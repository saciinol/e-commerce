import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { Role } from '@prisma/client';
import { CategoryController } from '../../controllers/category.controller.js';

const router = Router();

router.post('/', authenticate, authorize([Role.ADMIN, Role.SUPER_ADMIN]), CategoryController.create);

export default router;
