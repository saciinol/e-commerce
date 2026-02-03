import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

export class CategoryController {
	static getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    
  });

  static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  });
}
