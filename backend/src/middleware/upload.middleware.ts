import multer, { FileFilterCallback } from 'multer';
import type { Request } from 'express';
import { randomUUID } from 'crypto';
import path from 'path';
import { ValidationError } from '../utils/errors.js';

const storage = multer.diskStorage({
	destination: function (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void,
	) {
		cb(null, 'uploads/products');
	},
	filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
		const ext = path.extname(file.originalname);
		cb(null, `${path.basename(file.originalname, ext)}-${randomUUID()}${ext}`);
	},
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
	const ext = path.extname(file.originalname).toLowerCase();

	if (allowed.includes(ext)) cb(null, true);
	else cb(new ValidationError('Invalid file type'));
};

export const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
