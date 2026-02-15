import { Prisma } from '@prisma/client';
import { Order } from '../../types/order.types.js';
import { NotFoundError } from '../errors.js';

type MapOrderProps = Prisma.OrderGetPayload<{
  include: { items: true }
}>

export function mapOrder(o: MapOrderProps | null): Order {
	if (!o) {
		throw new NotFoundError(`Order not found`);
	}

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
		cancelledAt: o.cancelledAt ?? null,

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
}
