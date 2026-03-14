import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreateReviewSchema, GetAllReviewsSchema, GetReviewSchema } from '../validators/review.validator.js';
import { ReviewService } from '../services/review.service.js';

export class ReviewController {
	static getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10 } = (req.validated as GetAllReviewsSchema).query;

    const reviews = await ReviewService.getAll({ page, limit });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  });

	static getReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { id } = (req.validated as GetReviewSchema).params;

		const review = await ReviewService.getReview(id);

    res.status(200).json({
			success: true,
			data: review,
		});
	});

	static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const userId = req.user!.id;
		const data = (req.validated as CreateReviewSchema).body;

		const review = await ReviewService.create(userId, data);

		res.status(201).json({
			success: true,
			data: review,
		});
	});

	static update = asyncHandler(async (req: Request, res: Response): Promise<void> => {});

	static delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
}
