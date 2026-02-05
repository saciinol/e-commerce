import { z } from 'zod';

const addressBodySchema = z.object({
	fullName: z.string().trim().min(1).max(255),
	phone: z.string().trim().min(1).max(100),
	addressLine1: z.string().trim().min(1).max(255),
	addressLine2: z.string().trim().min(1).max(255).optional(),
	city: z.string().trim().min(1).max(255),
	province: z.string().trim().min(1).max(255),
	postalCode: z.string().trim().min(1).max(100),
	country: z.string().trim().min(1).max(255).default('Philippines'),
	isDefault: z.coerce.boolean().optional().default(false),
});

const idParamsSchema = z.object({
	id: z.coerce.number().int().positive('Invalid Address ID'),
});

export const createAddressSchema = z.object({
	body: addressBodySchema,
});

export const updateAddressSchema = z.object({
	body: addressBodySchema.partial(),
	params: idParamsSchema,
});

export const deleteAddressSchema = z.object({
	params: idParamsSchema,
});

export type CreateAddressDto = z.infer<typeof createAddressSchema>['body'];
export type CreateAddressSchema = z.infer<typeof createAddressSchema>;

export type UpdateAddressDto = z.infer<typeof updateAddressSchema>['body'];
export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;

export type DeleteAddressSchema = z.infer<typeof deleteAddressSchema>;
