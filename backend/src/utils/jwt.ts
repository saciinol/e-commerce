import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';

export const generateToken = (userId: number, email: string, role: string) => {
	const accessToken = jwt.sign({ userId, email, role }, config.jwt.secret, { expiresIn: '15m' });
	const refreshToken = jwt.sign({ userId, email, role }, config.jwt.refresh_secret, { expiresIn: '7d' });

	return { accessToken, refreshToken };
};
