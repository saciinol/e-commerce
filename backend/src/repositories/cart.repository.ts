import { prisma } from '../prisma.js';
import { Cart, CartItem } from '../types/cart.types.js';
import { mapCart } from '../utils/cart/mapCart.js';
import { mapCartItem } from '../utils/cart/mapCartItem.js';
import { CreateCartItemDto, UpdateCartItemDto } from '../validators/cart.validator.js';

export class CartRepository {
	static findByCartItemId = async (id: number): Promise<CartItem> => {
		const cartItem = await prisma.cartItem.findUnique({
			where: { id },
			include: {
				product: {
					select: {
						id: true,
						name: true,
						price: true,
					},
				},
				variant: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return mapCartItem(cartItem);
	};

	static findByUserId = async (id: number): Promise<Cart> => {
		const cart = await prisma.cart.findUnique({
			where: { userId: id },
			select: {
				id: true,
				userId: true,
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								price: true,
							},
						},
						variant: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
		});

		return mapCart(cart);
	};

	static addToCart = async (data: CreateCartItemDto, cartId: number): Promise<CartItem> => {
		const cartItem = await prisma.cartItem.create({
			data: { ...data, cartId },
			include: {
				product: {
					select: {
						id: true,
						name: true,
						price: true,
					},
				},
				variant: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return mapCartItem(cartItem);
	};

	static updateCartItem = async (id: number, data: UpdateCartItemDto): Promise<CartItem> => {
		const cartItem = await prisma.cartItem.update({
			where: { id },
			data,
			include: {
				product: {
					select: {
						id: true,
						name: true,
						price: true,
					},
				},
				variant: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return mapCartItem(cartItem);
	};

	static deleteCartItem = async (id: number): Promise<void> => {
		await prisma.cartItem.delete({
			where: { id },
		});
	};
}
