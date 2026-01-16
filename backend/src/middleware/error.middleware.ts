import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/errors.js';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
	logger.error('Error', {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
	});

	// zod validation errors
	if (err instanceof ZodError) {
		const fieldErrors = err.issues.reduce<Record<string, string[]>>((acc, issue) => {
			const key = issue.path.join('.') || 'root';
			acc[key] ??= [];
			acc[key].push(issue.message);
			return acc;
		}, {});

		res.status(400).json({
			status: 'error',
			message: 'Validation failed',
			errors: fieldErrors,
		});

		return;
	}

	// application issues
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			status: 'error',
			message: err.message,
			...(err instanceof ValidationError && err.errors && { errors: err.errors }),
		});

		return;
	}

	// unknown errors
	res.status(500).json({
		status: 'error',
		message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
	});
};
