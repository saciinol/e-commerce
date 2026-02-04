import { Request, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler.js";
import { UnauthorizedError } from '../utils/errors.js';
import { CartService } from '../services/cart.service.js';
import { CreateCartItemSchema } from '../validators/cart.validator.js';

export class CartController {
  static getCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const id = req.user.id;

    const cart = await CartService.getCart(id);

    res.status(200).json({
      success: true,
      data: cart,
    })
  })

  static addToCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const cartItemData = (req.validated as CreateCartItemSchema).body;
    const userId = req.user.id;

    const cartItem = await CartService.addToCart(userId, cartItemData);

    res.status(200).json({
      success: true,
      data: cartItem,
    })
  })

  static updateCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })

  static deleteCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })
}