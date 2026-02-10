import { z } from 'zod';

export const getOrderSchema = z.object({
  params: z.object({
		id: z.coerce.number().int().positive('Invalid Order ID'),
  })
})

export const createOrderSchema = z.object({
	body: z.object({
		cartId: z.coerce.number().int().positive('Invalid Cart ID'),

		// Payment
		paymentMethod: z.string().trim().min(1).max(255),
		paymentIntentId: z.string().trim().min(1).max(255).optional(),

		// // Shipping
		shippingAddressId: z.coerce.number().int().positive('Invalid Shipping Address ID'),
		billingAddressId: z.coerce.number().int().positive('Invalid Billing Address ID'),

		// // Coupon
		couponCode: z.string().trim().min(1).max(255).optional(),

		// // Notes
		customerNote: z.string().trim().min(1).max(255).optional(),
		// adminNote: z.string().trim().min(1).max(255).optional(),
	}),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>['body'];
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type GetOrderSchema = z.infer<typeof getOrderSchema>;
