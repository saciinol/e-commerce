import { Router } from 'express';
import authRoutes from './auth.routes.js';
import addressRoutes from './address.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import adminAuthRoutes from './admin/auth.routes.js';
import adminCategoryRoutes from './admin/category.routes.js';
import adminProductRoutes from './admin/product.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/address', addressRoutes);
router.use('/category', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/order', orderRoutes);

router.use('/admin', adminAuthRoutes);
router.use('/admin/category', adminCategoryRoutes);
router.use('/admin/products', adminProductRoutes);

export default router;
