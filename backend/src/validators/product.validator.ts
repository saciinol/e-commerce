import { z } from 'zod';

const productBodySchema = z.object({
	name: z.string().trim().min(1).max(255),
	sku: z.string().min(1).max(100),
	price: z.coerce.number().positive('Price must be greater than 0'),
	categoryId: z.coerce.number().int('Category must be an integer').positive(),

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
});

export const createProductSchema = z.object({
	body: productBodySchema.refine((data) => data.comparePrice === undefined || data.comparePrice > data.price, {
		path: ['comparePrice'],
		message: 'Compare price must be greater than price',
	}),
});

export const updateProductSchema = z.object({
	body: productBodySchema
		.partial()
		.refine((data) => data.comparePrice === undefined || data.price === undefined || data.comparePrice > data.price, {
			path: ['comparePrice'],
			message: 'Compare price must be greater than price',
		}),
	params: z.object({
		id: z.coerce.number().int().positive('Invalid Product ID'),
	}),
});

export const productAttributeSchema = z.object({
	name: z.string().trim().min(1).max(100),
	value: z.string().trim().min(1).max(255),
});


export const createProductAttributesSchema = z.object({
	body: z
		.array(productAttributeSchema)
		.min(1, 'At least one attribute is required'),
	params: z.object({
		id: z.coerce.number().int().positive('Invalid Product ID'),
	}),
});

export const variantOptionSchema = z.object({
	name: z.string().trim().min(1).max(50),
	value: z.string().trim().min(1).max(50),
});

export const productVariantSchema = z.object({
	name: z.string().trim().min(1).max(100),
	sku: z.string().trim().min(1).max(100),

	price: z.coerce.number().positive().optional(),
	stock: z.coerce.number().int().min(0).optional().default(0),
	isActive: z.coerce.boolean().optional().default(true),

	options: z
		.array(variantOptionSchema)
		.min(1, 'Variant must have at least one option'),
});

export const createProductVariantsSchema = z.object({
	body: z
		.array(productVariantSchema)
		.min(1, 'At least one variant is required'),
	params: z.object({
		id: z.coerce.number().int().positive('Invalid Product ID'),
	}),
});

export const getProductIdSchema = z.object({
	params: z.object({
		id: z.coerce.number().int().positive('Invalid Product ID'),
	}),
});

export const getProductsSchema = z.object({
	query: z.object({
		page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default(1),
		limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default(10),
	}),
});

export type CreateProductDto = z.infer<typeof createProductSchema>['body'];
export type UpdateProductDto = z.infer<typeof updateProductSchema>['body'];
export type GetProductIdParams = z.infer<typeof getProductIdSchema>['params'];
export type GetProductsQuery = z.infer<typeof getProductsSchema>['query'];
export type CreateProductAttributesDto = z.infer<typeof createProductAttributesSchema>['body'];
export type CreateProductVariantsDto = z.infer<typeof createProductVariantsSchema>['body'];

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type GetProductIdSchema = z.infer<typeof getProductIdSchema>;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
export type CreateProductAttributesSchema = z.infer<typeof createProductAttributesSchema>;
export type CreateProductVariantsSchema = z.infer<typeof createProductVariantsSchema>;
