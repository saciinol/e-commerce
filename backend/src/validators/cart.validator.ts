import { z } from 'zod';

export const createCartItemSchema = z.object({
	body: z.object({
		productId: z.coerce.number().int().positive('Invalid Product ID'),
		variantId: z.coerce.number().int().positive('Invalid Variant ID').optional(),
		quantity: z.coerce.number().int().positive('Invalid quantity'),
		price: z.coerce.number().positive('Price must be greater than 0'),
	}),
});

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>['body'];
export type CreateCartItemSchema = z.infer<typeof createCartItemSchema>;
