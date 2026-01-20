import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
	password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const registerSchema = z
	.object({
		email: z.email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
		name: z.string().min(2, { message: 'Name must be atleast 2 characters' }).optional(),
		password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
		password_confirmation: z.string(),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "Passwords don't match",
		path: ['password_confirmation'],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
