import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreateOrderSchema } from '../validators/order.validator.js';
import { OrderService } from '../services/order.service.js';

export class OrderController {
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
