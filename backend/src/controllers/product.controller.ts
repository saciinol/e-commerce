import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
	CreateProductSchema,
	GetProductIdSchema,
	GetProductsSchema,
	UpdateProductSchema,
} from '../validators/product.validator.js';
import { ProductService } from '../services/product.service.js';

export class ProductController {
	static getProductsPublic = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { page = 1, limit = 10 } = (req.validated as GetProductsSchema).query;

		const products = await ProductService.getProductsPublic({ page, limit });

		res.status(200).json({
			success: true,
			data: products,
		});
	});

	static getProductPublic = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as GetProductIdSchema).params;

		const product = await ProductService.getProductByIdPublic(id);

		res.status(200).json({
			success: true,
			data: product,
		});
	});

	static getProductsAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { page = 1, limit = 10 } = (req.validated as GetProductsSchema).query;

		const products = await ProductService.getProductsAdmin({ page, limit });

		res.status(200).json({
			success: true,
			data: products,
		});
	});

	static getProductAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as GetProductIdSchema).params;

		const product = await ProductService.getProductByIdAdmin(id);

		res.status(200).json({
			success: true,
			data: product,
		});
	});

	static createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const productData = (req.validated as CreateProductSchema).body;

		const product = await ProductService.createProduct(productData);

		res.status(201).json({
			success: true,
			data: product,
		});
	});

	static updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const productData = (req.validated as UpdateProductSchema).body;
		const { id } = (req.validated as GetProductIdSchema).params;

		const product = await ProductService.updateProduct(productData, id);

		res.status(200).json({
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
