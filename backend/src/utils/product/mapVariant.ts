import { Prisma } from '@prisma/client';
import { ProductVariantAdmin } from '../../types/product.types.js';
import { NotFoundError } from '../errors.js';

type MapVariantProps = Prisma.ProductVariantGetPayload<{
	select: {
		id: true;
		productId: true;
		name: true;
		sku: true;
		price: true;
		stock: true;
		isActive: true;
		options: true;
	};
}>;

export function mapVariant(p: MapVariantProps | null): ProductVariantAdmin {
	if (!p) {
		throw new NotFoundError(`Product not found`);
	}

	return {
		id: p.id,
		productId: p.productId,
		name: p.name,
		sku: p.sku,
		price: p.price?.toNumber() ?? null,
		stock: p.stock,
		isActive: p.isActive,
		options: (p.options ?? null).map((opt) => ({
			id: opt.id,
			variantId: opt.variantId,
			name: opt.name,
			value: opt.value,
		})),
	};
}
