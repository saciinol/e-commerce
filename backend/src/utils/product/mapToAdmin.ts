import { ProductAdmin } from '../../types/product.types.js';
import { NotFoundError } from '../errors.js';
import { Prisma } from '@prisma/client';

type MapToAdminProps = Prisma.ProductGetPayload<{
	select: {
		id: true;
		name: true;
		slug: true;
		sku: true;

		price: true;
		comparePrice: true;
		cost: true;

		shortDescription: true;

		stock: true;
		lowStockThreshold: true;
		trackInventory: true;

		isActive: true;
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
		metaTitle: true;
		metaDescription: true;

		viewCount: true;
		salesCount: true;
		averageRating: true;

		category: {
			select: {
				id: true;
				name: true;
				slug: true;
			};
		};

		createdAt: true;
		updatedAt: true;
	};
}>;

// interface MapToAdminProps extends MapToPublicProps {
// 	sku: string;
// 	cost: Decimal | null;
// 	stock: number;
// 	lowStockThreshold: number;
// 	trackInventory: boolean;
// 	isActive: boolean;
// 	variants: {
// 		id: number;
// 		sku: string;
// 		name: string;
// 		price: Decimal | null;
// 		stock: number;
// 		isActive: boolean;
// 		options: VariantOption[];
// 	}[];
// 	metaTitle: string | null;
// 	metaDescription: string | null;
// 	viewCount: number;
// 	salesCount: number;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

export function mapToAdmin(p: MapToAdminProps | null): ProductAdmin {
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
			sku: variant.sku,
			name: variant.name,
			price: variant.price?.toNumber() ?? null,
			stock: variant.stock,
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
		sku: p.sku,
		cost: p.cost?.toNumber() ?? null,
		stock: p.stock,
		lowStockThreshold: p.lowStockThreshold,
		trackInventory: p.trackInventory,
		isActive: p.isActive,
		metaTitle: p.metaTitle ?? null,
		metaDescription: p.metaDescription ?? null,
		viewCount: p.viewCount,
		salesCount: p.salesCount,
		createdAt: p.createdAt,
		updatedAt: p.updatedAt,
	};
}
