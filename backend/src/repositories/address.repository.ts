import { prisma } from '../prisma.js';
import { Address } from '../types/address.types.js';
import { CreateAddressDto, UpdateAddressDto } from '../validators/address.validator.js';

export class AddressRepository {
	static findById = async (id: number): Promise<Address | null> => {
		return await prisma.address.findUnique({
			where: { id },
		});
	};

	static findManyByUserId = async (userId: number): Promise<Address[]> => {
		return await prisma.address.findMany({
			where: { userId },
		});
	};

	static create = async (userId: number, data: CreateAddressDto): Promise<Address> => {
		return await prisma.address.create({
			data: { ...data, userId },
		});
	};

	static update = async (id: number, data: UpdateAddressDto): Promise<Address> => {
		return await prisma.address.update({
			where: { id },
			data,
		});
	};

	static delete = async (id: number): Promise<void> => {
		await prisma.address.delete({
			where: { id },
		});
	};
}
