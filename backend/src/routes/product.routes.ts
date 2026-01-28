import { Router } from 'express';
import { validate } from '../middleware/validation.middleware.js';
import { getProductIdSchema, getProductsSchema } from '../validators/product.validator.js';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();

router.get('/', validate(getProductsSchema), ProductController.getProductsPublic);

router.get('/:id', validate(getProductIdSchema), ProductController.getProductPublic);

export default router;
