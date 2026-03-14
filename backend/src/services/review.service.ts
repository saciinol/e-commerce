import { ReviewRepository } from "../repositories/review.repositories.js";
import { Review } from "../types/review.types.js";
import { CreateReviewDto, GetAllReviewsQuery } from "../validators/review.validator.js";

export class ReviewService {
	static getAll = async (params: GetAllReviewsQuery): Promise<void> => {
		const { page, limit } = params;
		const skip = (page - 1) * limit;

  };

  static getReview = async (id: number): Promise<Review> => {
    const review = await ReviewRepository.findById(id);

    return review;
  };

  static create = async (userId: number, data: CreateReviewDto): Promise<Review> => {
    const review = await ReviewRepository.create(userId, data);

    return review;
  };

  static update = async (): Promise<void> => {

  };

  static delete = async (): Promise<void> => {

  };
}
