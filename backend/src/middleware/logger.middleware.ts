import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	// generate unique request ID
	const requestId = uuidv4();
	req.requestId = requestId;
};
