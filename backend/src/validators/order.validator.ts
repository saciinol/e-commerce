import { z } from 'zod';
import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@prisma/client';

export const orderItemBodySchema = z.object({
	productId: z.coerce.number().int().positive('Invalid Product ID'),
	variantId: z.coerce.number().int().positive('Invalid Variant ID').optional(),

	quantity: z.coerce.number().int().positive('Invalid quantity'),
	price: z.coerce.number().positive('Price must be greater than 0'),

	productName: z.string().trim().min(1).max(255),
	productImageUrl: z.string().min(1).optional(),
	productSku: z.string().min(1).max(100),
});

export const createOrderSchema = z.object({
	body: z.object({
		// Pricing
		subtotal: z.coerce.number().positive('Subtotal must be greater than 0'),
		tax: z.coerce.number().positive('Tax must be greater than 0'),
		shippingCost: z.coerce.number().positive('Shipping Cost must be greater than 0'),
		discount: z.coerce.number().positive().optional().default(0),
		total: z.coerce.number().positive('Total must be greater than 0'),

		// Status
		status: z
			.enum(Object.values(OrderStatus) as [OrderStatus, ...OrderStatus[]])
			.optional()
			.default(OrderStatus.PENDING),
		paymentStatus: z
			.enum(Object.values(PaymentStatus) as [PaymentStatus, ...PaymentStatus[]])
			.optional()
			.default(PaymentStatus.PENDING),
		fulfillmentStatus: z
			.enum(Object.values(FulfillmentStatus) as [FulfillmentStatus, ...FulfillmentStatus[]])
			.optional()
			.default(FulfillmentStatus.UNFULFILLED),

		// Payment
		paymentMethod: z.string().trim().min(1).max(255),
		paymentIntentId: z.string().trim().min(1).max(255).optional(),

		// // Shipping
		shippingAddressId: z.coerce.number().int().positive('Invalid Shipping Address ID'),
		billingAddressId: z.coerce.number().int().positive('Invalid Billing Address ID'),
		trackingNumber: z.string().trim().min(1).max(255).optional(),

		// // Coupon
		couponCode: z.string().trim().min(1).max(255).optional(),

		// // Notes
		customerNote: z.string().trim().min(1).max(255).optional(),
		adminNote: z.string().trim().min(1).max(255).optional(),

		// // Timestamps
		paidAt: z.iso.datetime().optional(),
		shippedAt: z.iso.datetime().optional(),
		deliveredAt: z.iso.datetime().optional(),
		cancelledAt: z.iso.datetime().optional(),

		// // Relations
		items: z.array(orderItemBodySchema).min(1, 'At least one product is required'),
	}),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>['body'];
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type OrderItemSchema = z.infer<typeof orderItemBodySchema>;
