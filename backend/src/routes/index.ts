import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import adminProductRoutes from './admin.product.routes.js';
import adminAuthRoutes from './admin.auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminAuthRoutes);
router.use('/admin/products', adminProductRoutes);

export default router;



/*

app.use('/uploads', express.static('uploads'));
url: "/uploads/products/123-main.jpg"
POST /products/:id/images

import multer from 'multer';

const upload = multer({
  dest: 'uploads/products/',
});

req.file.filename

await prisma.productImage.create({
  data: {
    productId: Number(req.params.id),
    url: `/uploads/products/${req.file.filename}`,
    isDefault: true,
  },
});

<img src={product.images[0].url} />

product.image.ts

import { randomUUID } from 'crypto';

filename: `${randomUUID()}.jpg`

*/