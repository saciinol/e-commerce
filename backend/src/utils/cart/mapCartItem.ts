import { CartItem } from '../../types/cart.types.js';
import { NotFoundError } from '../errors.js';
import { Prisma } from '@prisma/client';

type MapCartItemProps = Prisma.CartItemGetPayload<{
	include: {
		product: {
			select: {
				id: true;
				name: true;
				price: true;
				sku: true;
			};
		};
		variant: {
			select: {
				id: true;
				name: true;
				price: true;
				sku: true;
			};
		};
	};
}>;

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
		product: {
			id: c.product.id,
			name: c.product.name,
			price: c.product.price.toNumber(),
			sku: c.product.sku,
		},
		variant: {
			id: c.variant?.id ?? null,
			name: c.variant?.name ?? null,
			price: c.product?.price.toNumber() ?? null,
			sku: c.product?.sku ?? null,
		},
	};
}
