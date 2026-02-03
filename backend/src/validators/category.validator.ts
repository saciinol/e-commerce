import { z } from 'zod';

export const getCategoriesSchema = z.object({
	body: z.object({
		name: z.string().trim().min(1).max(255),
		description: z.string().max(5000).optional(),
		displayOrder: z.coerce.number().int().positive(),
	}),
});

export type GetCategoriesDto = z.infer<typeof getCategoriesSchema>['body'];
export type GetCategoriesSchema = z.infer<typeof getCategoriesSchema>;
