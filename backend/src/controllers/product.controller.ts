import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreateProductSchema, GetProductIdSchema } from '../validators/product.validator.js';
import { ProductService } from '../services/product.service.js';

export class ProductController {
	static getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    
  })

	static createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const productData = (req.validated as CreateProductSchema).body;

		const product = await ProductService.createProduct(productData);

		res.status(201).json({
			success: true,
			data: product,
		});
	});

	static deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as GetProductIdSchema).params;

		await ProductService.deleteProduct(id);

		res.status(204).send();
	});
}
