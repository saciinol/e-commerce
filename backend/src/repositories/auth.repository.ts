import { prisma } from '../prisma.js';
import { RegisterDto, ResetPasswordDto } from '../validators/auth.validator.js';

export class AuthRepository {
	static adminRegister = (data: RegisterDto) => {
		return prisma.user.create({
			data: {
				...data,
				role: 'ADMIN',
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
			},
		});
	};

	static register = (data: RegisterDto) => {
		return prisma.user.create({
			data,
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	};

	static findByEmail = (email: string) => {
		return prisma.user.findUnique({
			where: { email },
		});
	};

	static findById = (id: number) => {
		return prisma.user.findUnique({
			where: { id },
		});
	};

	// static resetPassword = (email: string, password: ResetPasswordDto) => {
	// 	return prisma.user.update({
	// 		data: { password },
	// 		where: { email },
	// 	});
	// };
}
