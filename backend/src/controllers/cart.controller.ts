import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CartService } from '../services/cart.service.js';
import { CreateCartItemSchema, DeleteCartItemSchema, UpdateCartItemSchema } from '../validators/cart.validator.js';

export class CartController {
	static getCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const id = req.user!.id;

		const cart = await CartService.getCart(id);

		res.status(200).json({
			success: true,
			data: cart,
		});
	});

	static addToCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const cartItemData = (req.validated as CreateCartItemSchema).body;
		const userId = req.user!.id;

		const cartItem = await CartService.addToCart(userId, cartItemData);

		res.status(201).json({
			success: true,
			data: cartItem,
		});
	});

	static updateCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as UpdateCartItemSchema).params;
		const updateData = (req.validated as UpdateCartItemSchema).body;

		const cartItem = await CartService.updateCartItem(id, updateData);

		res.status(200).json({
			success: true,
			data: cartItem,
		});
	});

	static deleteCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as DeleteCartItemSchema).params;

		await CartService.deleteCartItem(id);

		res.status(204).send();
	});
}
