import { prisma } from '../prisma.js';
import { Cart } from '../types/cart.types.js';
import { mapCart } from '../utils/mapCart.js';

export class CartRepository {
	static findCartByUserId = async (id: number): Promise<Cart> => {
		const cart = await prisma.cart.findUnique({
			where: { userId: id },
			select: {
				id: true,
				userId: true,
				items: true,
			},
		});

		return mapCart(cart);
	};
}
