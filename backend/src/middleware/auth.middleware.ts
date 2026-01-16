import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { UnauthorizedError } from '../utils/errors.js';

interface JwtPayload {
	userId: string;
	email: string;
}

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new UnauthorizedError('No token provided');
	}

	const token = authHeader.split(' ')[1];
});
