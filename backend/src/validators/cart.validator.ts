import { z } from 'zod';

export const createCartItemSchema = z.object({
	body: z.object({
		productId: z.coerce.number().int().positive('Invalid Product ID'),
		variantId: z.coerce.number().int().positive('Invalid Variant ID').optional(),
		quantity: z.coerce.number().int().positive('Invalid quantity'),
		price: z.coerce.number().positive('Price must be greater than 0'),
	}),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.coerce.number().int().positive('Invalid quantity'),
		price: z.coerce.number().positive('Price must be greater than 0'),
  }),
	params: z.object({
		id: z.coerce.number().int().positive('Invalid Cart ID'),
	}),
});

export const deleteCartItemSchema = z.object({
	params: z.object({
		id: z.coerce.number().int().positive('Invalid Cart Item ID'),
	}),
});

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>['body'];
export type CreateCartItemSchema = z.infer<typeof createCartItemSchema>;

export type UpdateCartItemParams = z.infer<typeof updateCartItemSchema>['params'];
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>['body'];
export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;

export type DeleteCartItemDto = z.infer<typeof deleteCartItemSchema>['params'];
export type DeleteCartItemSchema = z.infer<typeof deleteCartItemSchema>;
