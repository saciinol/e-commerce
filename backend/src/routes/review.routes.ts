import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { ReviewController } from '../controllers/review.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createReviewSchema, getReviewSchema } from '../validators/review.validator.js';

const router = Router();

router.get('/', ReviewController.getAll);
router.get('/:id', validate(getReviewSchema), ReviewController.getReview);
router.post('/', authenticate, validate(createReviewSchema), ReviewController.create);
router.put('/:id', authenticate, ReviewController.update);
router.delete('/:id', authenticate, ReviewController.delete);

export default router;
