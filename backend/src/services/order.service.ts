import { OrderRepository } from '../repositories/order.repository.js';
import { Order } from '../types/order.types.js';
import { createOrderNumber } from '../utils/orderNumber.js';
import { CreateOrderDto } from '../validators/order.validator.js';

export class OrderService {
	static create = async (userId: number, orderData: CreateOrderDto): Promise<Order> => {
		const order = await createOrderNumber((orderNumber) =>
			OrderRepository.createOrder(userId, { ...orderData, orderNumber }),
		);

		return order;
	};
}
