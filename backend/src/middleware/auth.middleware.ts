import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError, ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { config } from '../config/environment.js';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';
import { TokenPayload } from '../services/token.service.js';

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new UnauthorizedError('No token provided');
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
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
		if (error instanceof jwt.TokenExpiredError) {
			throw new UnauthorizedError('Token expired');
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new UnauthorizedError('Invalid token');
		}
		throw error;
	}
});

export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		next();
		return;
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

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

		next();
	} catch (error) {
		logger.debug('Optional Auth: Invalid or expired token');
	}
});

// authorize(['user', 'admin', 'moderator'])
export const authorize = (allowedRoles: string[]) => {
	return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			throw new UnauthorizedError('Authentication required');
		}

		if (!allowedRoles.includes(req.user.role)) {
			throw new ForbiddenError('Insufficient permissions');
		}

		next();
	});
};

export const validateRefreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// get from cookie first (more secure), then fallback to boody
	const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

	if (!refreshToken) {
		throw new AppError(400, 'Refresh token required');
	}

	const storedToken = await prisma.refreshToken.findUnique({
		where: { token: refreshToken },
		include: { user: true },
	});

	if (!storedToken || storedToken.isRevoked) {
		throw new UnauthorizedError('Invalid refresh token');
	}

	if (storedToken.expiresAt < new Date()) {
		throw new UnauthorizedError('Refresh token expired');
	}

	if (!storedToken.user.isActive) {
		throw new UnauthorizedError('User is inactive');
	}

	req.user = {
		id: storedToken.user.id,
		email: storedToken.user.email,
		role: storedToken.user.role,
	};

	next();
});
