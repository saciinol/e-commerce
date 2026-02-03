import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CategoryService } from '../services/category.service.js';
import { GetCategoriesSchema } from '../validators/category.validator.js';

export class CategoryController {
	static getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const categories = await CategoryService.getCategories();

		res.status(200).json({
			success: true,
			data: categories,
		});
	});

	static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const categoryData = (req.validated as GetCategoriesSchema).body;

		const category = await CategoryService.create(categoryData);

		res.status(201).json({
			success: true,
			data: category,
		});
	});
}
