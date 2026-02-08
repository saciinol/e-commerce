import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createOrderSchema } from '../validators/order.validator.js';
import { OrderController } from '../controllers/order.controller.js';

const router = Router();

router.post('/', authenticate, validate(createOrderSchema), OrderController.create);

export default router;
