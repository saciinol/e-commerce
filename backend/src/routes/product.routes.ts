import { Router } from 'express';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createProductSchema, getProductIdSchema, getProductsSchema } from '../validators/product.validator.js';
import { ProductController } from '../controllers/product.controller.js';
import { Role } from '@prisma/client';

const router = Router();

// admin route
router.post(
	'/admin/create-product',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(createProductSchema),
	ProductController.createProduct,
);
router.delete(
	'/admin/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.deleteProduct,
);

// all roles route
router.get('/', optionalAuth, validate(getProductsSchema), ProductController.getProducts);
router.get('/:id', optionalAuth, validate(getProductIdSchema), ProductController.getProduct);

export default router;
