import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import { Order } from '../../types/order.types.js';
import { NotFoundError } from '../errors.js';
import { Decimal } from '@prisma/client/runtime/library';

interface mapAllOrdersProps {
	id: number;
	orderNumber: string;
	userId: number;

	// Pricing
	subtotal: Decimal;
	tax: Decimal;
	shippingCost: Decimal;
	discount: Decimal;
	total: Decimal;

	// Status
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	fulfillmentStatus: FulfillmentStatus;

	// Payment
	paymentMethod: string;
	paymentIntentId?: string | null;

	// Shipping
	shippingAddressId: number;
	billingAddressId: number;
	trackingNumber?: string | null;

	// Coupon
	couponCode?: string | null;

	// Notes
	customerNote?: string | null;
	adminNote?: string | null;

	// Timestamps
	paidAt?: Date | null;
	shippedAt?: Date | null;
	deliveredAt?: Date | null;
	cancelledAt?: Date | null;

	createdAt: Date;
	updatedAt: Date;

	items: {
		id: number;
		orderId: number;
		productId: number;
		variantId?: number | null;
		quantity: number;
		price: Decimal;

		productName: string;
		productImageUrl?: string | null;
		productSku: string;
	}[];
}

export function mapAllOrders(orders: mapAllOrdersProps[] | null): Order[] {
	if (!orders) {
		throw new NotFoundError(`Cart not found`);
	}

	return orders.map((o) => {
		return {
			id: o.id,
			orderNumber: o.orderNumber,
			userId: o.userId,

			// Pricing
			subtotal: o.subtotal.toNumber(),
			tax: o.tax.toNumber(),
			shippingCost: o.shippingCost.toNumber(),
			discount: o.discount.toNumber(),
			total: o.total.toNumber(),

			// Status
			status: o.status,
			paymentStatus: o.paymentStatus,
			fulfillmentStatus: o.fulfillmentStatus,

			// Payment
			paymentMethod: o.paymentMethod,
			paymentIntentId: o.paymentIntentId ?? null,

			// Shipping
			shippingAddressId: o.shippingAddressId,
			billingAddressId: o.billingAddressId,
			trackingNumber: o.trackingNumber ?? null,

			// Coupon
			couponCode: o.couponCode ?? null,

			// Notes
			customerNote: o.customerNote ?? null,
			adminNote: o.adminNote ?? null,

			// Timestamps
			paidAt: o.paidAt ?? null,
			shippedAt: o.shippedAt ?? null,
			deliveredAt: o.deliveredAt ?? null,
			cancelledAt: o.createdAt ?? null,

			createdAt: o.createdAt,
			updatedAt: o.updatedAt,

			items: (o.items ?? []).map((item) => ({
				id: item.id,
				orderId: item.orderId,
				productId: item.productId,
				variantId: item.variantId ?? null,
				quantity: item.quantity,
				price: item.price.toNumber(),

				productName: item.productName,
				productImageUrl: item.productImageUrl ?? null,
				productSku: item.productSku,
			})),
		};
	});
}
