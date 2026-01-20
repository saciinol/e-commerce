import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.email('Invalid email address'),
		name: z.string().min(2, 'Name must be atleast 2 characters').optional(),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		password_confirmation: z.string(),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "Passwords don't match",
		path: ['password_confirmation'],
	});

export const loginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
