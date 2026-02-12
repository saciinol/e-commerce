import { VariantOption } from '@prisma/client';
import { ProductVariant } from '../../types/product.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from '../errors.js';

interface MapVariantProps {
	id: number;
	productId?: number;
	name: string;
	sku: string;
	price?: Decimal | null;
	stock: number;
	isActive: boolean;
	options: VariantOption[];
}

export function mapVariant(p: MapVariantProps | null): ProductVariant {
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
