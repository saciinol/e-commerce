export interface Address {
	id: number;
	userId: number;
	fullName: string;
	phone: string;
	addressLine1: string;
	addressLine2?: string | null;
	city: string;
	province: string;
	postalCode: string;
	country: string;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
}
