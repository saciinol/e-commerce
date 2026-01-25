export interface ProductPublicDto {
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
  }
}

export interface ProductAdminDto {
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
};
