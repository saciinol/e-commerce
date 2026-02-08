import { Order } from '../types/order.types.js';
import { CreateOrderDto } from '../validators/order.validator.js';

export class OrderService {
	static create = async (userId: number, orderData: CreateOrderDto): Promise<void> => {
		const { items, ...data } = orderData;
	};
}
