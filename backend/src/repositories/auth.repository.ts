import { prisma } from '../prisma.js';
import { RegisterDto } from '../validators/auth.validator.js';

export const register = (data: RegisterDto) => {
	return prisma.user.create({
		data,
		select: {
			id: true,
			email: true,
			name: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

export const findByEmail = (email: string) => {
	return prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			name: true,
			password: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};
