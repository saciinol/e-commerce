import bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from '../validators/auth.validator.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { UnauthorizedError } from '../utils/errors.js';
import { TokenService } from './token.service.js';

export class AuthService {
	static register = async (userData: RegisterDto, deviceInfo?: string, ipAddress?: string) => {
		const hashedPW = await bcrypt.hash(userData.password, 12);

		const user = await AuthRepository.register({ ...userData, password: hashedPW });

		// generate tokens
		const tokens = await TokenService.generateTokenPair(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			deviceInfo,
			ipAddress,
		);

		return {
			tokens,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		};
	};

	static login = async (userData: LoginDto, deviceInfo?: string, ipAddress?: string) => {
		const user = await AuthRepository.findByEmail(userData.email);
		if (!user || !user.isActive) {
			throw new UnauthorizedError('Invalid email or password');
		}

		const isValid = await bcrypt.compare(userData.password, user.password);
		if (!isValid) {
			throw new UnauthorizedError('Invalid email or password');
		}

		// generate tokens
		const tokens = await TokenService.generateTokenPair(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			deviceInfo,
			ipAddress,
		);

		return {
			tokens,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		};
	};
}
