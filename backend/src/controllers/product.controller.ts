import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
	CreateProductAttributesSchema,
	CreateProductSchema,
	CreateProductVariantsSchema,
	GetProductIdSchema,
	GetProductsSchema,
	UpdateProductSchema,
} from '../validators/product.validator.js';
import { ProductService } from '../services/product.service.js';
import { productImageService } from '../services/productImage.service.js';
import { ValidationError } from '../utils/errors.js';
import fs from 'fs';

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

	static createProductAttributes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const productAttributesData = (req.validated as CreateProductAttributesSchema).body;
		const productId = (req.validated as CreateProductAttributesSchema).params.id;

		const productAttributes = await ProductService.createProductAttributes(productId, productAttributesData);

		res.status(201).json({
			success: true,
			data: productAttributes,
		});
	});

	static createProductVariants = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const productVariantsData = (req.validated as CreateProductVariantsSchema).body;
		const productId = (req.validated as CreateProductVariantsSchema).params.id;

		const productVariants = await ProductService.createProductVariants(productId, productVariantsData);

		res.status(201).json({
			success: true,
			data: productVariants,
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

	static uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as GetProductIdSchema).params;
		const file = req.file;
		const isDefault: boolean = req.body.isDefault;

		if (!file) {
			throw new ValidationError('No image uploaded');
		}

		try {
			const image = await productImageService.upload(id, file.filename, isDefault);

			res.status(201).json({
				success: true,
				data: image,
			});
		} catch (error) {
			fs.unlinkSync(file.path);
			throw error;
		}
	});

	static deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as GetProductIdSchema).params;

		await ProductService.deleteProduct(id);

		res.status(204).send();
	});
}
