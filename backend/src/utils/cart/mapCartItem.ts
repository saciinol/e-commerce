import { CartItem } from '../../types/cart.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from '../errors.js';

interface MapCartItemProps {
	id: number;
	cartId: number;
	productId: number;
	variantId?: number | null;
	quantity: number;
	price: Decimal;
	createdAt: Date;
	updatedAt: Date;
}

export function mapCartItem(c: MapCartItemProps | null): CartItem {
	if (!c) {
		throw new NotFoundError(`Cart item not found`);
	}

	return {
		id: c.id,
		cartId: c.cartId,
		productId: c.productId,
		variantId: c.variantId ?? null,
		quantity: c.quantity,
		price: c.price.toNumber(),
		createdAt: c.createdAt,
		updatedAt: c.updatedAt,
	};
}
