import { prisma } from '../prisma.js';
import { Review } from '../types/review.types.js';
import { mapReview } from '../utils/mapReview.js';
import { CreateReviewDto } from '../validators/review.validator.js';

export class ReviewRepository {
	static create = async (userId: number, data: CreateReviewDto): Promise<Review> => {
		const review = await prisma.review.create({
			data: { ...data, userId },
		});

		return mapReview(review);
	};

	static findById = async (id: number): Promise<Review> => {
		const review = await prisma.review.findUnique({
			where: { id },
		});

    return mapReview(review);
	};

}
