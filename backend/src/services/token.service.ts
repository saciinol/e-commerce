import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';
import { RefreshTokenData, TokenPair, TokenPayload } from '../types/token.types.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const MAX_REFRESH_TOKENS_PER_USER = 5;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class TokenService {
	static generateAccessToken(payload: TokenPayload): string {
		return jwt.sign(payload, config.jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
	}

	static generateRawRefreshToken(): string {
		return crypto.randomBytes(64).toString('hex');
	}

	static hashToken(token: string): string {
		return crypto.createHmac('sha256', config.refreshTokenHashSecret).update(token).digest('hex');
	}

	// create and store refresh token in database
	static async createRefreshToken(data: RefreshTokenData): Promise<string> {
		const rawToken = this.generateRawRefreshToken();
		const tokenHash = this.hashToken(rawToken);
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

		return prisma.$transaction(async (tx) => {
			const userTokens = await tx.refreshToken.findMany({
				where: {
					userId: data.userId,
					isRevoked: false,
					expiresAt: { gt: new Date() },
				},
				orderBy: { createdAt: 'asc' },
			});

			// revoke oldest tokens if limit exceeded
			if (userTokens.length >= MAX_REFRESH_TOKENS_PER_USER) {
				const revokeCount = userTokens.length - MAX_REFRESH_TOKENS_PER_USER + 1;
				const tokensToRevoke = userTokens.slice(0, revokeCount);

				await tx.refreshToken.updateMany({
					where: {
						id: { in: tokensToRevoke.map((t) => t.id) },
					},
					data: { isRevoked: true },
				});
			}

			await tx.refreshToken.create({
				data: {
					token: tokenHash,
					userId: data.userId,
					expiresAt,
					deviceInfo: data.deviceInfo,
					ipAddress: data.ipAddress,
				},
			});

			return rawToken;
		});
	}

	// generate both access and refresh tokens
	static async generateTokenPair(user: TokenPayload, deviceInfo?: string, ipAddress?: string): Promise<TokenPair> {
		const accessToken = this.generateAccessToken(user);
		const refreshToken = await this.createRefreshToken({ userId: user.userId, deviceInfo, ipAddress });

		return { accessToken, refreshToken };
	}

	// validate and rotate refresh token
	static async rotateRefreshToken(
		oldRawToken: string,
		deviceInfo?: string,
		ipAddress?: string,
	): Promise<(TokenPair & TokenPayload) | null> {
		const oldHash = this.hashToken(oldRawToken);

		return prisma.$transaction(async (tx) => {
			const storedToken = await tx.refreshToken.findUnique({
				where: { token: oldHash },
				include: { user: true },
			});

			// if token doesn't exist
			if (!storedToken) {
				logger.warn('Refresh token not found:', { token: oldRawToken.substring(0, 10) });
				return null;
			}

			// SECURITY: token reuse detection
			if (storedToken.isRevoked) {
				logger.error('SECURITY: Refresh token reuse detected', {
					userId: storedToken.userId,
					token: oldRawToken.substring(0, 10),
				});

				// revoke all tokens for this user (possible token theft)
				await tx.refreshToken.updateMany({
					where: { userId: storedToken.userId },
					data: { isRevoked: true },
				});

				return null;
			}

			// token expired
			if (storedToken.expiresAt < new Date()) {
				await tx.refreshToken.update({
					where: { id: storedToken.id },
					data: { isRevoked: true },
				});
				return null;
			}

			// user inactive
			if (!storedToken.user.isActive) {
				return null;
			}

			// mark lastUsedOn old token
			await tx.refreshToken.update({
				where: { id: storedToken.id },
				data: { lastUsedAt: new Date() },
			});

			const newRaw = this.generateRawRefreshToken();
			const newHash = this.hashToken(newRaw);
			const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

			await tx.refreshToken.create({
				data: {
					token: newHash,
					userId: storedToken.userId,
					expiresAt: newExpiresAt,
					deviceInfo: deviceInfo,
					ipAddress: ipAddress,
				},
			});

			// revoke old token and link to new one (audit trail)
			await tx.refreshToken.update({
				where: { id: storedToken.id },
				data: {
					isRevoked: true,
					replacedBy: newHash,
				},
			});

			const accessToken = this.generateAccessToken({ userId: storedToken.userId, role: storedToken.user.role });

			return {
				accessToken,
				refreshToken: newRaw,
				userId: storedToken.user.id,
				role: storedToken.user.role,
			};
		});
	}

	// revoke a specific refresh token (logout from one device)
	static async revokeToken(rawToken: string): Promise<boolean> {
		try {
			const hash = this.hashToken(rawToken);
			await prisma.refreshToken.update({
				where: { token: hash },
				data: { isRevoked: true },
			});
			return true;
		} catch (error) {
			logger.error('Error revoking token:', error);
			return false;
		}
	}

	// revoke all refresh tokens for a year (logout from all devices)
	static async revokeAllUserTokens(userId: number): Promise<void> {
		await prisma.refreshToken.updateMany({
			where: { userId },
			data: { isRevoked: true },
		});
	}

	// get all active sessions for a user
	static async getUserSessions(userId: number) {
		return prisma.refreshToken.findMany({
			where: {
				userId,
				isRevoked: false,
				expiresAt: { gt: new Date() },
			},
			select: {
				id: true,
				deviceInfo: true,
				ipAddress: true,
				createdAt: true,
				lastUsedAt: true,
			},
			orderBy: { lastUsedAt: 'desc' },
		});
	}

	// clean expired tokens (run as cron job)
	static async cleanupExpiredTokens(): Promise<void> {
		const deleted = await prisma.refreshToken.deleteMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					// delete revoked tokens older than 30 days
					{ isRevoked: true, createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
				],
			},
		});

		logger.info(`Cleaned up ${deleted.count} expired refresh tokens`);
	}
}
