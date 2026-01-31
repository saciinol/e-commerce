import { ProductAdmin } from '../types/product.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from './errors.js';
import { MapProductToPublicProp } from './mapPrismaProductToPublic.js';

interface MapProductToAdminProp extends MapProductToPublicProp {
	sku: string;
	cost: Decimal | null;
	stock: number;
	lowStockThreshold: number;
	trackInventory: boolean;
	isActive: boolean;
	metaTitle: string | null;
	metaDescription: string | null;
	viewCount: number;
	salesCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export function mapPrismaProductToAdmin(p: MapProductToAdminProp | null): ProductAdmin {
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
