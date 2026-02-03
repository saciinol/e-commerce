import { Request, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler.js";

export class CartController {
  static getCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })

  static addToCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })

  static updateCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })

  static deleteCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  })
}