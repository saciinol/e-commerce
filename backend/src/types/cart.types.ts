export interface CartItem {
	id: number;
	cartId: number;
	productId: number;
	variantId?: number | null;
	quantity: number;
	price: number;
	createdAt: Date;
	updatedAt: Date;
	product: {
		id: number;
		name: string;
		price: number;
    sku: string;
	};
	variant?: {
		id?: number | null;
		name?: string | null;
	} | null;
}

export interface Cart {
	id: number;
	userId: number;
	items: CartItem[];
  createdAt: Date;
	updatedAt: Date;
}
