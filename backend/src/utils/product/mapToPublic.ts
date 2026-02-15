import { ProductPublic } from '../../types/product.types.js';
import { NotFoundError } from '../errors.js';
import { Prisma } from '@prisma/client';

type MapToPublicProps = Prisma.ProductGetPayload<{
	select: {
		id: true;
		name: true;
		slug: true;
		price: true;
		comparePrice: true;
		shortDescription: true;
		isFeatured: true;
		images: true;
		attributes: true;
		variants: {
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
		};
		averageRating: true;
		category: {
			select: {
				id: true;
				name: true;
				slug: true;
			};
		};
	};
}>;

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
