import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { LoginDto, LoginSchema, RegisterDto, RegisterSchema } from '../validators/auth.validator.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
	const userData: RegisterDto = (req.validated as RegisterSchema).body;

	const user = await authService.register(userData);

	res.status(201).json({
		status: 'success',
		token: user.accessToken,
		data: user.user,
	});
});

export const login = asyncHandler(async (req: Request, res: Response) => {
	const userData: LoginDto = (req.validated as LoginSchema).body;

	const user = await authService.login(userData);

	res.status(200).json({
		status: 'success',
		token: user.accessToken,
		data: user.newUser,
	});
});
