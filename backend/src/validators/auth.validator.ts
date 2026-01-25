import { z } from 'zod';

export const registerSchema = z.object({
	body: z.object({
		email: z.email({ message: 'Invalid email address' }),
		password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
		firstName: z.string().min(2, { message: 'First name must be atleast 2 characters' }).optional(),
		lastName: z.string().min(2, { message: 'Last name must be atleast 2 characters' }).optional(),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.email({ message: 'Invalid email address' }),
		password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
	}),
});

export type RegisterDto = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
