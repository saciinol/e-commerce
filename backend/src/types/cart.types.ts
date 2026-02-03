export interface CartItem {
	id: number;
	cartId: number;
	productId: number;
	variantId?: number | null;
	quantity: number;
	price: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Cart {
	id: number;
	userId: number;
	items: CartItem[];
}
