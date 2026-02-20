export interface Review {
  id: number;
  userId: number;
  productId: number;

  rating: number;
  title?: string | null;
  comment?: string | null;
  isVerifiedPurchase: boolean;
  isApproved: boolean;

  createdAt: Date;
  updatedAt: Date;
}