import { Cart } from '../../types/cart.types.js';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from '../errors.js';

interface MapCartProps {
	id: number;
	userId: number;
	items: {
		id: number;
		cartId: number;
		productId: number;
		variantId?: number | null;
		quantity: number;
		price: Decimal;
		createdAt: Date;
		updatedAt: Date;
		product: {
			id: number;
			name: string;
			price: Decimal;
			sku: string;
		};
		variant?: {
			id: number;
			name: string;
		} | null;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

export function mapCart(c: MapCartProps | null): Cart {
	if (!c) {
		throw new NotFoundError(`Cart not found`);
	}

	return {
		id: c.id,
		userId: c.userId,
		items: (c.items ?? []).map((item) => ({
			id: item.id,
			cartId: item.cartId,
			productId: item.productId,
			variantId: item.variantId ?? null,
			quantity: item.quantity,
			price: item.price.toNumber(),
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			product: {
				id: item.product.id,
				name: item.product.name,
				price: item.product.price.toNumber(),
				sku: item.product.sku,
			},
			variant: {
				id: item.variant?.id ?? null,
				name: item.variant?.name ?? null,
			},
		})),
		createdAt: c.createdAt,
		updatedAt: c.updatedAt,
	};
}
