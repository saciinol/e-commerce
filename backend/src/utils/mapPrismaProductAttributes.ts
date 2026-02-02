import { VariantOption } from '@prisma/client';
import { ProductVariant } from '../types/product.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from './errors.js';

interface mapPrismaProductVariantsProps {
	id: number;
	productId?: number;
	name: string;
	price?: Decimal | null;
	isActive: boolean;
	options: VariantOption[];
}

export function mapPrismaProductVariants(p: mapPrismaProductVariantsProps): ProductVariant {
	if (!p) {
		throw new NotFoundError(`Product not found`);
	}

	return {
		id: p.id,
		productId: p.productId,
		name: p.name,
		price: p.price?.toNumber() ?? null,
		isActive: p.isActive,
		options: (p.options ?? null).map((opt) => ({
			id: opt.id,
			variantId: opt.variantId,
			name: opt.name,
			value: opt.value,
		})),
	};
}
