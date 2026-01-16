import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.coerce.number().default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	throw new Error('failed');
}

export const config = {
	nodeEnv: parsed.data.NODE_ENV,
	port: parsed.data.PORT,
} as const;
