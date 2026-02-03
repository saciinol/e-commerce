import { z } from 'zod';

export const createCartItemSchema = z.object({
  body: z.object({
		id: z.coerce.number().int().positive('Invalid Product ID'),
  }),
});

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>['body'];
export type CreateCartItemSchema = z.infer<typeof createCartItemSchema>;
