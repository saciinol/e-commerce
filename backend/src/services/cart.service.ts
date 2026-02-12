import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { Cart, CartItem } from '../types/cart.types.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { CreateCartItemDto, UpdateCartItemDto } from '../validators/cart.validator.js';
import { ProductService } from './product.service.js';

export class CartService {
	static getCart = async (id: number): Promise<Cart> => {
		const cart = await CartRepository.findByUserId(id);

		return cart;
	};

	static addToCart = async (userId: number, data: CreateCartItemDto): Promise<CartItem> => {
		let item;
		if (data.variantId) {
			item = await ProductRepository.findProductVariantById(data.variantId);

			if (!item) {
				throw new NotFoundError(`Product variant with id ${data.variantId} not found`);
			}

			if (!item.price) {
				item = await ProductService.getProductByIdAdmin(item.productId!);
			}
		} else {
			item = await ProductService.getProductByIdAdmin(data.productId);
		}

		const { id } = await this.getCart(userId);

		const cartItem = await CartRepository.addToCart({ ...data, price: item.price! }, id);

		return cartItem;
	};

	static updateCartItem = async (id: number, data: UpdateCartItemDto): Promise<CartItem> => {
		const existingCartItem = await CartRepository.findByCartItemId(id);

		if (!existingCartItem) {
			throw new ValidationError('Cart item not found');
		}

		const cartItem = await CartRepository.updateCartItem(id, data);

		return cartItem;
	};

	static deleteCartItem = async (id: number): Promise<void> => {
		const existingCartItem = await CartRepository.findByCartItemId(id);

		if (!existingCartItem) {
			throw new ValidationError('Cart item not found');
		}

		CartRepository.deleteCartItem(id);
	};
}
