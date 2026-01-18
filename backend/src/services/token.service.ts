import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';
import { RefreshTokenData, TokenPair, TokenPayload } from '../types/custom.types.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const MAX_REFRESH_TOKENS_PER_USER = 5;

export class TokenService {
	static generateAccessToken(payload: TokenPayload): string {
		return jwt.sign(payload, config.jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
	}

	static generateRefreshToken(): string {
		return crypto.randomBytes(64).toString('hex');
	}

	// create and store refresh token in database
	static async createRefreshToken(data: RefreshTokenData): Promise<string> {
		const token = this.generateRefreshToken();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		// clean up old tokens if user has too many
		const userTokens = await prisma.refreshToken.findMany({
			where: {
				userId: data.userId,
				isRevoked: false,
				expiresAt: { gt: new Date() },
			},
			orderBy: { createdAt: 'asc' },
		});

		// revoke oldest tokens if limit exceeded
		if (userTokens.length >= MAX_REFRESH_TOKENS_PER_USER) {
			const tokensToRevoke = userTokens.slice(0, userTokens.length - MAX_REFRESH_TOKENS_PER_USER + 1);

			await prisma.refreshToken.updateMany({
				where: {
					id: { in: tokensToRevoke.map((t) => t.id) },
				},
				data: { isRevoked: true },
			});
		}

		await prisma.refreshToken.create({
			data: {
				token,
				userId: data.userId,
				expiresAt,
				deviceInfo: data.deviceInfo,
				ipAddress: data.ipAddress,
			},
		});

		return token;
	}

	// generate both access and refresh tokens
	static async generateTokenPair(user: TokenPayload, deviceInfo?: string, ipAddress?: string): Promise<TokenPair> {
		const accessToken = this.generateAccessToken(user);
		const refreshToken = await this.createRefreshToken({ userId: user.userId, deviceInfo, ipAddress });

		return { accessToken, refreshToken };
	}

	// validate and rotate refresh token
	// IMPORTANT: implements token rotation for security
	static async rotateRefreshToken(
		oldToken: string,
		deviceInfo?: string,
		ipAddress?: string,
	): Promise<TokenPair | null> {
		const storedToken = await prisma.refreshToken.findUnique({
			where: { token: oldToken },
			include: { user: true },
		});

		// if token doesn't exist
		if (!storedToken) {
			logger.warn('Refresh token not found:', { token: oldToken.substring(0, 10) });
			return null;
		}

		// SECURITY: token reuse detection
		if (storedToken.isRevoked) {
			logger.error('SECURITY: Refresh token reuse detected', {
				userId: storedToken.userId,
				token: oldToken.substring(0, 10),
			});

			// revoke all tokens for this user (possible token theft)
			await prisma.refreshToken.updateMany({
				where: { userId: storedToken.userId },
				data: { isRevoked: true },
			});

			return null;
		}

		// token expired
		if (storedToken.expiresAt < new Date()) {
			await prisma.refreshToken.update({
				where: { id: storedToken.id },
				data: { isRevoked: true },
			});
			return null;
		}

		// user inactive
		if (!storedToken.user.isActive) {
			return null;
		}

		// generate new token pair
		const newTokenPair = await this.generateTokenPair(
			{
				userId: storedToken.user.id,
				email: storedToken.user.email,
				role: storedToken.user.role,
			},
			deviceInfo,
			ipAddress,
		);

		// revoke old token and link to new one (audit trail)
		await prisma.refreshToken.update({
			where: { id: storedToken.id },
			data: {
				isRevoked: true,
				replacedBy: newTokenPair.refreshToken,
			},
		});

		return newTokenPair;
	}

	// revoke a specific refresh token (logout from one device)
	static async revokeToken(token: string): Promise<boolean> {
		try {
			await prisma.refreshToken.update({
				where: { token },
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
