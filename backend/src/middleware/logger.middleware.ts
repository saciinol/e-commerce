import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
	// generate unique request ID
	const requestId = uuidv4();
	req.requestId = requestId;

	// capture start time
	const startTime = Date.now();

	// log incoming request
	logger.info('Incoming Request', {
		requestId,
		method: req.method,
		url: req.url,
		ip: req.ip || req.socket.remoteAddress,
		userAgent: req.get('user-agent'),
	});

	// capture the original end function
	const originalEnd = res.end;

	// override res.end to log response
	res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
		// calculate response time
		const duration = Date.now() - startTime;

		// log response
		logger.info('Outgoing Response', {
			requestId,
			method: req.method,
			url: req.url,
			statusCode: res.statusCode,
			duration: `${duration}ms`,
		});

		// call original end function
		return originalEnd.call(this, chunk, encoding, callback);
	};

	next();
};

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
	logger.error('Request Error', {
		requestId: req.requestId,
		method: req.method,
		url: req.url,
		error: {
			message: err.message,
			sstack: err.stack,
			name: err.name,
		},
	});

	next(err);
};
