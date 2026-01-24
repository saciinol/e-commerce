import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email({ error: 'Invalid email address' }).min(1, { error: 'Email is required' }),
	password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
});

export const registerSchema = z
	.object({
		email: z.email({ error: 'Invalid email address' }).min(1, { error: 'Email is required' }),
		firstName: z.string().min(2, { message: 'First name must be atleast 2 characters' }).optional(),
		lastName: z.string().min(2, { message: 'Last name must be atleast 2 characters' }).optional(),
		password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
		password_confirmation: z.string(),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "Passwords don't match",
		path: ['password_confirmation'],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
