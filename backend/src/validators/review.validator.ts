import { z } from 'zod';

export const createReviewSchema = z.object({
	body: z.object({
		productId: z.coerce.number().int().positive('Invalid Product ID'),
    rating: z.coerce.number().int(),
    title: z.string().trim().min(1).max(500).optional(),
    coment: z.string().trim().min(1).max(500).optional(),
    isVerifiedPurchase: z.coerce.boolean().default(false),
    isApproved: z.coerce.boolean().default(false),
	}),
});

export const getReviewSchema = z.object({
  params: z.object({
		id: z.coerce.number().int().positive('Invalid Review ID'),
  })
})

export type CreateReviewDto = z.infer<typeof createReviewSchema>['body'];
export type CreateReviewSchema = z.infer<typeof createReviewSchema>;

export type GetReviewSchema = z.infer<typeof getReviewSchema>;


