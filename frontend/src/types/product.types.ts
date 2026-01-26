export interface ProductPublic {
	id: number;
	name: string;
	slug: string;
	price: number;
	comparePrice?: number;
	shortDescription?: string;
	averageRating: number;
	isFeatured: boolean;
	category: {
		id: number;
		name: string;
		slug: string;
	};
}

export interface ProductAdmin {
	id: number;

	// basic info
	name: string;
	slug: string;
	sku: string;

	// pricing
	price: number;
	comparePrice?: number | null;
	cost?: number | null;

	// inventory
	stock: number;
	lowStockThreshold: number;
	trackInventory: boolean;

	// status
	isActive: boolean;
	isFeatured: boolean;

	// seo
	metaTitle?: string | null;
	metaDescription?: string | null;

	// stats
	viewCount: number;
	salesCount: number;
	averageRating: number;

	// relations
	category: {
		id: number;
		name: string;
		slug: string;
	};

	// timestamps
	createdAt: string;
	updatedAt: string;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ProductsResponsePublic {
	success: boolean;
	data: {
		products: ProductPublic[];
		pagination: Pagination;
	};
}

export interface ProductsResponseAdmin {
	success: boolean;
	data: {
		products: ProductAdmin[];
		pagination: Pagination;
	};
}

export interface ProductResponsePublic {
	success: boolean;
	data: ProductPublic;
}

export interface ProductResponseAdmin {
	success: boolean;
	data: ProductAdmin;
}
