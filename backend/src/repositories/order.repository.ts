import { prisma } from '../prisma.js';
import { Order } from '../types/order.types.js';
import { mapOrder } from '../utils/mapOrder.js';
import { CreateOrderDto } from '../validators/order.validator.js';

export class OrderRepository {
	static createOrder = async (userId: number, data: CreateOrderDto): Promise<Order> => {
		const { items, ...orderData } = data;

		const order = await prisma.$transaction(async (tx) => {
			return await tx.order.create({
				data: {
					...orderData,
					userId,
					orderNumber: 'ORD-2026-0003', // create function for generating orderNumber
					items: {
						create: items,
					},
				},
				include: {
					items: true,
				},
			});
		});

		return mapOrder(order);
	};
}
