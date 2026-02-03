import { VariantOption } from '@prisma/client';
import { ProductVariant } from '../../types/product.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from '../errors.js';

interface MapVariantsProps {
	id: number;
	productId?: number;
	name: string;
	price?: Decimal | null;
	isActive: boolean;
	options: VariantOption[];
}

export function mapVariants(p: MapVariantsProps[]): ProductVariant[] {
	if (!p) {
		throw new NotFoundError(`Product not found`);
	}

	return p.map((variant) => {
		return {
			id: variant.id,
			productId: variant.productId,
			name: variant.name,
			price: variant.price?.toNumber() ?? null,
			isActive: variant.isActive,
			options: (variant.options ?? null).map((opt) => ({
				id: opt.id,
				variantId: opt.variantId,
				name: opt.name,
				value: opt.value,
			})),
		};
	});
}
