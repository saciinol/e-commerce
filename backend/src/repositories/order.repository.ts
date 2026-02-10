import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import { prisma } from '../prisma.js';
import { Order } from '../types/order.types.js';
import { mapOrder } from '../utils/mapOrder.js';
import { CreateOrderDto } from '../validators/order.validator.js';

type Data = Omit<CreateOrderDto, 'cartId'> & {
	orderNumber: string;

	subtotal: number;
	tax: number;
	shippingCost: number;
	discount: number;
	total: number;

	status: OrderStatus;
	paymentStatus: PaymentStatus;
	fulfillmentStatus: FulfillmentStatus;

	trackingNumber: string;

	paidAt?: Date | null;
	shippedAt?: Date | null;
	deliveredAt?: Date | null;
	cancelledAt?: Date | null;

	items: {
		productId: number;
		variantId?: number | null;
		quantity: number;
		price: number;

		// Snapshot of product details at time of order
		productName: string;
		productImageUrl?: string | null;
		productSku: string;
	}[];
};

export class OrderRepository {
	static createOrder = async (userId: number, data: Data): Promise<Order> => {
		const { items, ...orderData } = data;

		const order = await prisma.$transaction(async (tx) => {
			return await tx.order.create({
				data: {
					...orderData,
					userId,
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
