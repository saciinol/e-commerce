import dotenv from 'dotenv';
import z from 'zod';
import { ValidationError } from '../utils/errors.js';

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string().min(32),
	LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
	ALLOWED_ORIGINS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	const fieldErrors = parsed.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
		const key = issue.path.join('.') || 'root';
		acc[key] ??= [];
		acc[key].push(issue.message);
		return acc;
	}, {});

	throw new ValidationError('Invalid environment variables', fieldErrors);
}

export const config = {
	nodeEnv: parsed.data.NODE_ENV,
	port: parsed.data.PORT,
	database: {
		url: parsed.data.DATABASE_URL,
	},
	jwtSecret: parsed.data.JWT_SECRET,

	logLevel: parsed.data.LOG_LEVEL,
} as const;
