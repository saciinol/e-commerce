import { ProductAttribute, ProductImage, ProductPublic, VariantOption } from '../../types/product.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from '../errors.js';

export interface MapToPublicProps {
	id: number;
	name: string;
	slug: string;
	price: Decimal;
	comparePrice: Decimal | null;
	shortDescription: string | null;
	isFeatured: boolean;
	averageRating: Decimal;
	images: ProductImage[];
	attributes: ProductAttribute[];
	variants: {
		id: number;
		name: string;
		price: Decimal | null;
		isActive: boolean;
		options: VariantOption[];
	}[];
	category: {
		id: number;
		name: string;
		slug: string;
	};
}

export function mapToPublic(p: MapToPublicProps | null): ProductPublic {
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
			createdAt: img.createdAt,
		})),
		attributes: (p.attributes ?? []).map((attr) => ({
			id: attr.id,
			name: attr.name,
			value: attr.value,
		})),
		variants: (p.variants ?? []).map((variant) => ({
			id: variant.id,
			name: variant.name,
			price: variant.price?.toNumber() ?? null,
			isActive: variant.isActive,
			options: (variant.options ?? []).map((opt) => ({
				id: opt.id,
				name: opt.name,
				value: opt.value,
			})),
		})),
		category: {
			id: p.category.id,
			name: p.category.name,
			slug: p.category.slug,
		},
	};
}
