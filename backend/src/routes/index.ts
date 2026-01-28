import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import adminProductRoutes from './admin.product.routes.js';
import adminAuthRoutes from './admin.auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminProductRoutes);
router.use('/admin', adminAuthRoutes);

export default router;
