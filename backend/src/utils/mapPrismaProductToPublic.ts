import { ProductImage, ProductPublic } from '../types/product.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from './errors.js';

export interface MapProductToPublicProp {
	id: number;
	name: string;
	slug: string;
	price: Decimal;
	comparePrice: Decimal | null;
	shortDescription: string | null;
	isFeatured: boolean;
	averageRating: Decimal;
	images: ProductImage[];
	category: {
		id: number;
		name: string;
		slug: string;
	};
}

export function mapPrismaProductToPublic(p: MapProductToPublicProp | null): ProductPublic {
	if (!p) {
		throw new NotFoundError(`Product not found`);
	}

	return {
		id: p.id,
		name: p.name,
		slug: p.slug,
		price: p.price.toNumber(),
		comparePrice: p.comparePrice?.toNumber() ?? null,
		shortDescription: p.shortDescription ?? null,
		isFeatured: p.isFeatured,
		averageRating: p.averageRating.toNumber(),
		images: (p.images ?? []).map((img) => ({
			id: img.id,
			url: img.url,
			altText: img.altText ?? null,
			displayOrder: img.displayOrder,
			isDefault: img.isDefault,
		})),
		category: {
			id: p.category.id,
			name: p.category.name,
			slug: p.category.slug,
		},
	};
}
