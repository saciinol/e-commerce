import { prisma } from '../prisma.js';
import { RegisterDto } from '../validators/auth.validator.js';

export class AuthRepository {
	static register = (data: RegisterDto) => {
		return prisma.user.create({
			data,
			select: {
				id: true,
				email: true,
				name: true,
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
}
