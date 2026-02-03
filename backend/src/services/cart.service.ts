import { CartRepository } from "../repositories/cart.repository.js"
import { Cart } from "../types/cart.types.js";

export class CartService {
  static getCart = async (id: number): Promise<Cart> => {
    const cart = await CartRepository.findCartByUserId(id);

    return cart;
  }
}