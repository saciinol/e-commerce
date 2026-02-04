import { prisma } from '../prisma.js';
import { Cart, CartItem } from '../types/cart.types.js';
import { mapCart } from '../utils/cart/mapCart.js';
import { mapCartItem } from '../utils/cart/mapCartItem.js';
import { CreateCartItemDto } from '../validators/cart.validator.js';

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

	static addToCart = async (data: CreateCartItemDto, cartId: number): Promise<CartItem> => {
		const cartItem = await prisma.cartItem.create({
			data: { ...data, cartId },
		});

		return mapCartItem(cartItem);
	};
}
