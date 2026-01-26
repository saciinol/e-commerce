import z from 'zod';

export const adminCreateProductSchema = z
	.object({
		name: z.string().trim().min(1, 'Product name is required').max(255),
		sku: z.string().min(1, 'SKU is required').max(100),
		price: z.coerce.number().positive('Price must be greater than 0'),
		categoryId: z.coerce.number().int('Category must be an integer').positive('Category is required'),

		// optional text
		description: z.string().max(5000).optional(),
		shortDescription: z.string().max(500).optional(),

		// optional money/admin only-ish
		comparePrice: z.coerce.number().positive().optional(),
		cost: z.coerce.number().positive().optional(),

		// inventory
		stock: z.coerce.number().int().min(0).optional().default(0),
		lowStockThreshold: z.coerce.number().int().min(0).optional().default(10),
		trackInventory: z.coerce.boolean().optional().default(true),

		// status
		isActive: z.coerce.boolean().optional().default(true),
		isFeatured: z.coerce.boolean().optional().default(false),

		// seo
		metaTitle: z.string().max(255).optional(),
		metaDescription: z.string().max(500).optional(),
	})
	.refine((data) => data.comparePrice === undefined || data.comparePrice > data.price, {
		path: ['comparePrice'],
		message: 'Compare price must be greater than price',
	});

export type AdminCreateProductInput = z.infer<typeof adminCreateProductSchema>;
