import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { LoginDto, LoginSchema, RegisterDto, RegisterSchema, ResetPasswordDto, ResetPasswordSchema } from '../validators/auth.validator.js';
import { AuthService } from '../services/auth.service.js';
import { config } from '../config/environment.js';
import { UnauthorizedError } from '../utils/errors.js';
import { TokenService } from '../services/token.service.js';

export class AuthController {
	static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const userData: RegisterDto = (req.validated as RegisterSchema).body;
		const deviceInfo = req.headers['user-agent'];
		const ipAddress = req.ip;

		const { tokens, user } = await AuthService.register(userData, deviceInfo, ipAddress);

		// set refresh token in httpOnly cookie (most secure)
		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: config.nodeEnv === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.status(201).json({
			succes: true,
			data: {
				accessToken: tokens.accessToken,
				user,
			},
		});
	});

	static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const userData: LoginDto = (req.validated as LoginSchema).body;
		const deviceInfo = req.headers['user-agent'];
		const ipAddress = req.ip;

		const { tokens, user } = await AuthService.login(userData, deviceInfo, ipAddress);

		// set refresh token in httpOnly cookie (most secure)
		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: config.nodeEnv === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.json({
			success: true,
			data: {
				accessToken: tokens.accessToken,
				user,
			},
		});
	});

  // static resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  //   const password: ResetPasswordDto = (req.validated as ResetPasswordSchema).body.password;
  // })

	// refresh - rotate tokens
	static refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedError('Refresh token required');
		}

		const deviceInfo = req.headers['user-agent'];
		const ipAddress = req.ip;

		// rotate token
		const tokens = await TokenService.rotateRefreshToken(refreshToken, deviceInfo, ipAddress);

		if (!tokens) {
			res.clearCookie('refreshToken');
			throw new UnauthorizedError('Invalid or expired refresh token');
		}

		// update cookie with new refresh token
		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: config.nodeEnv === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.json({
			success: true,
			data: {
				accessToken: tokens.accessToken,
				user: {
					id: tokens.userId,
					email: tokens.email,
					name: tokens.name,
					role: tokens.role,
				},
			},
		});
	});

	static logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

		if (refreshToken) {
			await TokenService.revokeToken(refreshToken);
		}

		res.clearCookie('refreshToken');
		res.json({
			success: true,
			message: 'Logged out successfully',
		});
	});

	static logoutAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		if (!req.user) {
			throw new UnauthorizedError('Authentication required');
		}

		await TokenService.revokeAllUserTokens(req.user.id);
		res.clearCookie('refreshToken');

		res.json({
			success: true,
			message: 'Logged out from all devices',
		});
	});

	static getSessions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		if (!req.user) {
			throw new UnauthorizedError('Authentication required');
		}

		const sessions = await TokenService.getUserSessions(req.user.id);

		res.json({
			success: true,
			data: { sessions },
		});
	});
}
