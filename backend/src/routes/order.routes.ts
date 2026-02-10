import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createOrderSchema, getOrderSchema } from '../validators/order.validator.js';
import { OrderController } from '../controllers/order.controller.js';

const router = Router();

router.get('/', authenticate, OrderController.getAll);
router.get('/:id', authenticate, validate(getOrderSchema), OrderController.get);
router.post('/', authenticate, validate(createOrderSchema), OrderController.create);

export default router;
