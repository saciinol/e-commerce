export interface ProductImage {
	id: number;
	productId?: number;
	url: string;
	altText?: string | null;
	displayOrder: number;
	isDefault: boolean;
	createdAt: Date;
}

export interface ProductAttribute {
	id: number;
	productId?: number;
	name: string;
	value: string;
}

export interface VariantOption {
	id: number;
	variantId?: number;
	name: string;
	value: string;
}

export interface ProductVariant {
	id: number;
	productId?: number;
	name: string;
	price?: number | null;
	isActive: boolean;
	options: VariantOption[];
}

export interface ProductVariantAdmin extends ProductVariant {
	sku: string;
	stock: number;
}

export interface CategorySummary {
	id: number;
	name: string;
	slug: string;
}

interface ProductBase {
	id: number;
	name: string;
	slug: string;
	shortDescription: string | null;
	price: number;
	comparePrice: number | null;
	isFeatured: boolean;
	images: ProductImage[];
	attributes: ProductAttribute[];
	averageRating: number | null;
	category: CategorySummary;
}

export interface ProductPublic extends ProductBase {
	variants: ProductVariant[];
}

export interface ProductAdmin extends ProductBase {
	sku: string;
	cost?: number | null;
	stock: number;
	lowStockThreshold: number;
	trackInventory: boolean;
	isActive: boolean;
	metaTitle?: string | null;
	metaDescription?: string | null;
	variants: ProductVariantAdmin[];
	viewCount: number;
	salesCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface PaginatedProducts<T> {
	products: T[];
	pagination: Pagination;
}

export type ProductsPublicPaginated = PaginatedProducts<ProductPublic>;
export type ProductsAdminPaginated = PaginatedProducts<ProductAdmin>;
