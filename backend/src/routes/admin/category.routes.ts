import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { Role } from '@prisma/client';
import { CategoryController } from '../../controllers/category.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { getCategoriesSchema } from '../../validators/category.validator.js';

const router = Router();

router.post(
	'/',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getCategoriesSchema),
	CategoryController.create,
);

export default router;
