import { Cart } from '../../types/cart.types.js';
import { NotFoundError } from '../errors.js';
import { Prisma } from '@prisma/client';

type MapCartProps = Prisma.CartGetPayload<{
	include: {
		items: {
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
		};
	};
}>;

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
				price: item.variant?.price?.toNumber() ?? null,
				sku: item.variant?.sku,
			},
		})),
		createdAt: c.createdAt,
		updatedAt: c.updatedAt,
	};
}
