import { z } from 'zod';

const orderItemBodySchema = z.object({
	productId: z.coerce.number().int().positive('Invalid Product ID'),
	variantId: z.coerce.number().int().positive('Invalid Variant ID').optional(),

	quantity: z.coerce.number().int().positive('Invalid quantity'),
	price: z.coerce.number().positive('Price must be greater than 0'),

	productName: z.string().trim().min(1).max(255),
	productImageUrl: z.string().min(1),
	productSku: z.string().min(1).max(100),
});

export const createOrderItemSchema = z.object({
	body: z.array(orderItemBodySchema).min(1, 'At least one product is required'),
});

export const createOrderSchema = z.object({
	body: z.object({}),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>['body'];
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
