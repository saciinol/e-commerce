import { FulfillmentStatus, OrderStatus, PaymentStatus } from "@prisma/client";

export interface OrderItem {
	id: number;
	orderId: number;
	productId: number;
	variantId?: number | null;
	quantity: number;
	price: number;

	// Snapshot of product details at time of order
	productName: string;
	productImageUrl?: string | null;
	productSku: string;
}

export interface Order {
	id: number;
	orderNumber: string;
	userId: number;

	// Pricing
	subtotal: number;
	tax: number;
	shippingCost: number;
	discount: number;
	total: number;

	// Status
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	fulfillmentStatus: FulfillmentStatus;

	// Payment
	paymentMethod: string;
	paymentIntentId?: string | null;

	// Shipping
	shippingAddressId: number;
	billingAddressId: number;
	trackingNumber?: string | null;

	// Coupon
	couponCode?: string | null;

	// Notes
	customerNote?: string | null;
	adminNote?: string | null;

	// Timestamps
	paidAt?: Date | null;
	shippedAt?: Date | null;
	deliveredAt?: Date | null;
	cancelledAt?: Date | null;

	createdAt: Date;
	updatedAt: Date;

	// Relations
	items: OrderItem[];
}
