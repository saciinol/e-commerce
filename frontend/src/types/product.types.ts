interface ProductImage {
	id: number;
	url: string;
	altText?: string | null;
	displayOrder: number;
	isDefault: boolean;
}

interface ProductBase {
	id: number;
	name: string;
	slug: string;
	price: number;
	comparePrice: number | null;
	shortDescription: string | null;
	isFeatured: boolean;
	images: ProductImage[];
	averageRating: number | null;
	category: {
		id: number;
		name: string;
		slug: string;
	};
}

export type ProductPublic = ProductBase;

export interface ProductAdmin extends ProductBase {
	sku: string;
	cost: number | null;
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

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
}

export interface PaginatedResponse<T> {
	products: T[];
	pagination: Pagination;
}

export type ProductsPublicResponse = ApiResponse<PaginatedResponse<ProductPublic>>;
export type ProductsAdminResponse = ApiResponse<PaginatedResponse<ProductAdmin>>;
export type ProductPublicResponse = ApiResponse<ProductPublic>;
export type ProductAdminResponse = ApiResponse<ProductAdmin>;
