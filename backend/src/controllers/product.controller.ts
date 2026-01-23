import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreateProductSchema } from '../validators/product.validator.js';
import { ProductService } from '../services/product.service.js';

export class ProductController {
	static createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const productData = (req.validated as CreateProductSchema).body;

		const product = await ProductService.createProduct(productData);

		res.status(201).json({
			success: true,
			data: product,
		});
	});
}
