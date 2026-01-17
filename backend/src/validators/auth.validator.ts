import { z } from 'zod';

export const registerSchema = z.object({
	body: z.object({
		email: z.email('Invalid email address'),
		name: z.string().min(2, 'Name must be atleast 2 characters').optional(),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	}),
});

export type RegisterDto = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
