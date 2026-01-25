import { Router } from 'express';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createProductSchema } from '../validators/product.validator.js';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();

// admin route
router.post(
	'/admin/create-product',
	authenticate,
	authorize(['ADMIN', 'SUPER_ADMIN']),
	validate(createProductSchema),
	ProductController.createProduct,
);
router.delete('/admin/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), ProductController.deleteProduct);

// all roles route
router.get('/', optionalAuth, ProductController.getProducts);
router.get('/:id', optionalAuth, ProductController.getProduct);

export default router;
