import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
	createProductSchema,
	getProductIdSchema,
	getProductsSchema,
	updateProductSchema,
} from '../validators/product.validator.js';
import { ProductController } from '../controllers/product.controller.js';
import { Role } from '@prisma/client';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

router.get(
	'/products',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductsSchema),
	ProductController.getProductsAdmin,
);

router.get(
	'/products/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.getProductAdmin,
);

router.post(
	'/products',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(createProductSchema),
	ProductController.createProduct,
);

router.put(
	'/products/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(updateProductSchema),
	ProductController.updateProduct,
);

router.delete(
	'/products/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.deleteProduct,
);

export default router;
