import { Request, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler.js";
import { AddressService } from '../services/address.service.js';
import { CreateAddressSchema, DeleteAddressSchema, UpdateAddressSchema } from '../validators/address.validator.js';
import { AddressRepository } from '../repositories/address.repository.js';

export class AddressController {
  	static getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const id = req.user!.id;

		const address = await AddressService.getAll(id);

		res.status(200).json({
			success: true,
			data: address,
		});
	});

	static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const addressData = (req.validated as CreateAddressSchema).body;
		const userId = req.user!.id;

		const address = await AddressService.create(userId, addressData);

		res.status(201).json({
			success: true,
			data: address,
		});
	});

	static update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = (req.validated as UpdateAddressSchema).params;
		const updateData = (req.validated as UpdateAddressSchema).body;

		const address = await AddressService.update(id, updateData);

		res.status(200).json({
			success: true,
			data: address,
		});
	});

	static delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as DeleteAddressSchema).params;

		await AddressRepository.delete(id);

		res.status(204).send();
	});
}