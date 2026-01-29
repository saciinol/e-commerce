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
import { upload } from '../config/multer.js';

const router = Router();

router.get(
	'/',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductsSchema),
	ProductController.getProductsAdmin,
);

router.get(
	'/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.getProductAdmin,
);

router.post(
	'/',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(createProductSchema),
	ProductController.createProduct,
);

router.put(
	'/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(updateProductSchema),
	ProductController.updateProduct,
);

router.post(
	'/:id/images',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	upload.single('image'),
	ProductController.uploadImage,
);

router.delete(
	'/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.deleteProduct,
);

export default router;
