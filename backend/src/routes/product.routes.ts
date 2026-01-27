import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
	createProductSchema,
	getProductIdSchema,
	getProductsSchema,
	updateProductSchema,
} from '../validators/product.validator.js';
import { ProductController } from '../controllers/product.controller.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', validate(getProductsSchema), ProductController.getProductsPublic);

router.get(
	'/admin',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductsSchema),
	ProductController.getProductsAdmin,
);

router.get('/:id', validate(getProductIdSchema), ProductController.getProductPublic);

router.get(
	'/admin/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.getProductAdmin,
);
router.post(
	'/admin',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(createProductSchema),
	ProductController.createProduct,
);
router.put(
	'/admin/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(updateProductSchema),
	ProductController.updateProduct,
);
router.delete(
	'/admin/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.deleteProduct,
);

export default router;
