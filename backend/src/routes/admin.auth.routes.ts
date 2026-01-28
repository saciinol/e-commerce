import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';
import { Role } from '@prisma/client';
import { registerSchema } from '../validators/auth.validator.js';

const router = Router();

// super admin creates admin account
router.post(
	'/register',
	authenticate,
	authorize([Role.SUPER_ADMIN]),
	validate(registerSchema),
	AuthController.adminRegister,
);

export default router;
