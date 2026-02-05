import bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from '../validators/auth.validator.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { UnauthorizedError, ValidationError } from '../utils/errors.js';
import { TokenService } from './token.service.js';

export class AuthService {
	static adminRegister = async (adminData: RegisterDto) => {
		const existingEmail = await AuthRepository.findByEmail(adminData.email);
		if (existingEmail) {
			throw new ValidationError('Email already exist');
		}

		const salt = await bcrypt.genSalt(12);
		const hashedPW = await bcrypt.hash(adminData.password, salt);

		const admin = await AuthRepository.adminRegister({ ...adminData, password: hashedPW });

		return admin;
	};

	static register = async (userData: RegisterDto, deviceInfo?: string, ipAddress?: string) => {
		const existingEmail = await AuthRepository.findByEmail(userData.email);
		if (existingEmail) {
			throw new ValidationError('Email already exist');
		}

		const salt = await bcrypt.genSalt(12);
		const hashedPW = await bcrypt.hash(userData.password, salt);

		const user = await AuthRepository.register({ ...userData, password: hashedPW });

		// generate tokens
		const tokens = await TokenService.generateTokenPair(
			{
				userId: user.id,
				role: user.role,
			},
			deviceInfo,
			ipAddress,
		);

		return {
			tokens,
			user: {
				id: user.id,
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
				role: user.role,
			},
			deviceInfo,
			ipAddress,
		);

		return {
			tokens,
			user: {
				id: user.id,
				role: user.role,
			},
		};
	};
}
