import { CreateOrderDto, OrderItemSchema } from '../validators/order.validator.js';

export class OrderRepository {
	static createOrder = async (userId: number, data: Omit<CreateOrderDto, 'items'>): Promise<void> => {

  };

  static createOrderItem = async (orderId: number, data: OrderItemSchema): Promise<void> => {
    
  }
}
