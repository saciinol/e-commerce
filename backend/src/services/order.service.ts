import { OrderRepository } from '../repositories/order.repository.js';
import { Order } from '../types/order.types.js';
import { CreateOrderDto } from '../validators/order.validator.js';

export class OrderService {
	static create = async (userId: number, orderData: CreateOrderDto): Promise<Order> => {
    const order = await OrderRepository.createOrder(userId, orderData);

    return order;
	};
}
