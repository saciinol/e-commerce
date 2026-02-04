import { CartRepository } from '../repositories/cart.repository.js';
import { Cart, CartItem } from '../types/cart.types.js';
import { CreateCartItemDto } from '../validators/cart.validator.js';
import { ProductService } from './product.service.js';

export class CartService {
	static getCart = async (id: number): Promise<Cart> => {
		const cart = await CartRepository.findCartByUserId(id);

		return cart;
	};

	static addToCart = async (userId: number, data: CreateCartItemDto): Promise<CartItem> => {
		await ProductService.getProductByIdPublic(data.productId);
		const { id } = await this.getCart(userId);

		const cartItem = await CartRepository.addToCart(data, id);

		return cartItem;
	};
}
