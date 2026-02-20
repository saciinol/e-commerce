import { ReviewRepository } from "../repositories/review.repositories.js";
import { Review } from "../types/review.types.js";
import { CreateReviewDto } from "../validators/review.validator.js";

export class ReviewService {
	static getAll = async (): Promise<void> => {

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
