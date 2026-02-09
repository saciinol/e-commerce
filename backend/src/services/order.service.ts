import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import crypto from 'crypto';
import { CartRepository } from '../repositories/cart.repository.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { Order } from '../types/order.types.js';
import { NotFoundError } from '../utils/errors.js';
import { createOrderNumber } from '../utils/orderNumber.js';
import { CreateOrderDto } from '../validators/order.validator.js';

export class OrderService {
	static create = async (userId: number, orderData: CreateOrderDto): Promise<Order> => {
		const { cartId, ...newOrderData } = orderData;
		const cart = await CartRepository.findByCartId(cartId);

		if (!cart) {
			throw new NotFoundError('No cart found');
		}

		const { items: oldItems, ...cartData } = cart;
		const items = oldItems.map((item) => {
			return {
				productId: item.productId,
				variantId: item.variantId ?? null,
				quantity: item.quantity,
				price: item.price,

				// Snapshot of product details at time of order
				productName: item.product.name,
				// productImageUrl: item.product.url ?? null,
				productSku: item.product.sku,
			};
		});

		// pricing
		const subtotal = oldItems.map((item) => item.price).reduce((acc, curr) => acc + curr);
		const tax = 83.0;
		const shippingCost = 150.0;
		const discount = 0.0;
		const total = subtotal + tax + shippingCost - discount;

		// status
		const status = OrderStatus.PENDING;
		const paymentStatus = PaymentStatus.PENDING;
		const fulfillmentStatus = FulfillmentStatus.UNFULFILLED;

		const trackingNumber = `#${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

		const paidAt = new Date();
		const shippedAt = new Date();
		const deliveredAt = new Date();
		const cancelledAt = new Date();

		const order = await createOrderNumber((orderNumber) =>
			OrderRepository.createOrder(userId, {
				...orderData,
				orderNumber,
				subtotal,
				tax,
				shippingCost,
				discount,
				total,
				status,
				paymentStatus,
				fulfillmentStatus,
				trackingNumber,
				paidAt,
				shippedAt,
				deliveredAt,
				cancelledAt,
				items,
			}),
		);

		return order;
	};
}
