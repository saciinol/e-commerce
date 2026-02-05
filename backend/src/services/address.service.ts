import { AddressRepository } from '../repositories/address.repository.js';
import { Address } from '../types/address.types.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateAddressDto, UpdateAddressDto } from '../validators/address.validator.js';

export class AddressService {
	static getAll = async (id: number): Promise<Address[]> => {
		const address = await AddressRepository.findManyByUserId(id);

		if (!address) {
			throw new NotFoundError('Address not found');
		}

		return address;
	};

	static create = async (userId: number, data: CreateAddressDto): Promise<Address> => {
		const address = await AddressRepository.create(userId, data);

		return address;
	};

	static update = async (id: number, data: UpdateAddressDto): Promise<Address> => {
		const existingAddress = await AddressRepository.findById(id);

		if (!existingAddress) {
			throw new NotFoundError('Address not found');
		}

		const address = await AddressRepository.update(id, data);

		return address;
	};

	static delete = async (id: number): Promise<void> => {
    const existingAddress = await AddressRepository.findById(id);

		if (!existingAddress) {
			throw new NotFoundError('Address not found');
		}

    await AddressRepository.delete(id);
  };
}
