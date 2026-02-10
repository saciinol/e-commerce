import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreateOrderSchema, GetOrderSchema } from '../validators/order.validator.js';
import { OrderService } from '../services/order.service.js';

export class OrderController {
	static getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const userId = req.user!.id;

		const orders = await OrderService.getAll(userId);

		res.status(200).json({
			success: true,
			data: orders,
		});
	});

	static get = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as GetOrderSchema).params;

		const order = await OrderService.get(id);

		res.status(200).json({
			success: true,
			data: order,
		});
	});

	static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const userId = req.user!.id;
		const orderData = (req.validated as CreateOrderSchema).body;

		const order = await OrderService.create(userId, orderData);

		res.status(201).json({
			success: true,
			data: order,
		});
	});
}
