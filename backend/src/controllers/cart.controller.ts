import { Request, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler.js";
import { UnauthorizedError } from '../utils/errors.js';
import { CartService } from '../services/cart.service.js';

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
    
  })

  static updateCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })

  static deleteCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })
}