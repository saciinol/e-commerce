import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { config } from '../config/environment.js';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';
import { TokenPayload } from '../types/token.types.js';

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new UnauthorizedError('No token provided');
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
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
		const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
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

// authorize(['CUSTOMER', 'ADMIN', 'SUPER_ADMIN])
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
