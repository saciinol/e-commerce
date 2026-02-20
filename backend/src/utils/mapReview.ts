import { Prisma } from '@prisma/client';
import { Review } from '../types/review.types.js';
import { NotFoundError } from './errors.js';

type MapReviewProps = Prisma.ReviewGetPayload<{}>;

export function mapReview(r: MapReviewProps | null): Review {
	if (!r) {
		throw new NotFoundError(`Review not found`);
	}

	return {
		id: r.id,
		userId: r.userId,
		productId: r.productId,

		rating: r.rating,
		title: r.title ?? null,
		comment: r.comment ?? null,
		isVerifiedPurchase: r.isVerifiedPurchase,
		isApproved: r.isApproved,

		createdAt: r.createdAt,
		updatedAt: r.updatedAt,
	};
}
