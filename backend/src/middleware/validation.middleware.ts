import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validate = <T extends ZodType>(schema: T) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			req.validated = await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			next(error);
		}
	};
};
