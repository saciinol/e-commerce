import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { AppError } from './errors.js';

type createFn<T> = (orderNumber: string) => Promise<T>;

export async function createOrderNumber<T>(create: createFn<T>): Promise<T> {
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const orderNumber = `ORD-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

		try {
			return await create(orderNumber);
		} catch (e) {
			// Retry only on unique constraint conflict
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === 'P2002' &&
				Array.isArray(e.meta?.target) &&
				e.meta.target.includes('orderNumber')
			) {
				continue;
			}
			throw e;
		}
	}

	throw new AppError(400, 'Could not generate order number after multiple attempts');
}
