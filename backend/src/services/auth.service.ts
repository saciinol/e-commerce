import bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from '../validators/auth.validator.js';
import * as authRepository from '../repositories/auth.repository.js';
import { UnauthorizedError } from '../utils/errors.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (userData: RegisterDto) => {
	const hashedPW = await bcrypt.hash(userData.password, 12);

	const user = await authRepository.register({ ...userData, password: hashedPW });

	const { accessToken } = generateToken(user.id, user.email, 'user');

	return { accessToken, user };
};

export const login = async (userData: LoginDto) => {
	const user = await authRepository.findByEmail(userData.email);
	if (!user) {
		throw new UnauthorizedError('Invalid email or password');
	}

	const isPWValid = await bcrypt.compare(userData.password, user.password);
	if (!isPWValid) {
		throw new UnauthorizedError('Invalid email or password');
	}

	const { password, ...newUser } = user;

	const { accessToken } = generateToken(user.id, user.email, 'user');

	return { accessToken, newUser };
};
