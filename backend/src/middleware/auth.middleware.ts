import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError, ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { config } from '../config/environment.js';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';

interface JwtPayload {
	userId: number;
	email: string;
	role: string;
	iat?: number;
	exp?: number;
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedError('No token provided');
		}

		const token = authHeader.split(' ')[1];

		let decoded: JwtPayload;
		try {
			decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new UnauthorizedError('Token expired');
			}
			if (error instanceof jwt.JsonWebTokenError) {
				throw new UnauthorizedError('Invalid token');
			}
			throw error;
		}

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.userId,
			},
			select: {
				id: true,
				email: true,
				name: true,
			},
		});

		if (!user) {
			throw new UnauthorizedError('User not found');
		}

		req.user = {
			id: user.id,
			email: user.email,
			role: decoded.role,
		};

		next();
	} catch (error) {
		logger.error('Authentication error:', error);
		next(error);
	}
});

export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			next();
			return;
		}

		const token = authHeader.split(' ')[1];
		try {
			const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

			const user = await prisma.user.findUnique({
				where: { id: decoded.userId },
				select: {
					id: true,
					email: true,
					name: true,
				},
			});

			if (user) {
				req.user = {
					id: user.id,
					email: user.email,
					role: decoded.role,
				};
			}
		} catch (error) {
			logger.debug('Optional Auth: Invalid or expired token');
		}

		next();
	} catch (error) {
		logger.error('optional authentication error', error);
		next();
	}
});

// authorize(['user', 'admin', 'moderator'])
export const authorize = (allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			throw new UnauthorizedError('Authentication required');
		}

		if (!allowedRoles.includes(req.user.role)) {
			throw new ForbiddenError('Insufficient permissions');
		}

		next();
	};
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			throw new AppError(400, 'Refresh token required');
		}

		try {
			const decoded = jwt.verify(refreshToken, config.jwt.refresh_secret) as JwtPayload;

			req.user = {
				id: decoded.userId,
				email: decoded.email,
				role: decoded.role,
			};

			next();
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new UnauthorizedError('Refresh token expired');
			}

			throw new UnauthorizedError('Invalid refresh token');
		}
	} catch (error) {
		logger.error('Refresh token validation error', error);
		next(error);
	}
};
