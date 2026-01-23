import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createProductSchema } from '../validators/product.validator.js';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();

router.post(
	'/admin/create-product',
	authenticate,
	authorize(['ADMIN', 'SUPER_ADMIN']),
	validate(createProductSchema),
	ProductController.createProduct,
);

export default router;
