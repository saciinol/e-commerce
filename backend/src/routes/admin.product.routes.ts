import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
	createProductSchema,
	getProductIdSchema,
	getProductsSchema,
	updateProductSchema,
} from '../validators/product.validator.js';
import { ProductController } from '../controllers/product.controller.js';
import { Role } from '@prisma/client';
import { validate } from '../middleware/validation.middleware.js';
import { randomUUID } from 'crypto';
import path from 'path';

import multer from 'multer';
import { ValidationError } from '../utils/errors.js';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/products');
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, `${path.basename(file.originalname, ext)}-${randomUUID()}${ext}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
	const ext = path.extname(file.originalname).toLowerCase();

	if (allowed.includes(ext)) cb(null, true);
	else cb(new ValidationError('Invalid file type'));
};

const upload = multer({ storage, fileFilter });

const router = Router();

router.post('/upload', upload.single('image'), (req, res) => {
	console.log(req.file);
});

router.get(
	'/',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductsSchema),
	ProductController.getProductsAdmin,
);

router.get(
	'/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.getProductAdmin,
);

router.post(
	'/',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(createProductSchema),
	ProductController.createProduct,
);

router.put(
	'/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(updateProductSchema),
	ProductController.updateProduct,
);

router.delete(
	'/:id',
	authenticate,
	authorize([Role.ADMIN, Role.SUPER_ADMIN]),
	validate(getProductIdSchema),
	ProductController.deleteProduct,
);

export default router;
