import { Prisma } from '@prisma/client';
import { AppError } from './errors.js';

export function slugify(text: string) {
	return text
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '') // remove quotes
		.replace(/[^a-z0-9]+/g, '-') // non-alnum -> hyphen
		.replace(/^-+|-+$/g, ''); // trim hyphens
}

type CreateFn<T> = (slug: string) => Promise<T>;

type SlugOptions = {
	fallback?: string; // default slug if slugify returns empty
	maxAttempts?: number; // default 10
};

export async function createUniqueSlug<T>(
	sourceText: string,
	createWithSlug: CreateFn<T>,
	options: SlugOptions = {},
): Promise<T> {
	const fallback = options.fallback ?? 'item';
	const maxAttempts = options.maxAttempts ?? 10;

	const base = slugify(sourceText) || fallback;

	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;

		try {
			return await createWithSlug(slug);
		} catch (e) {
			// Retry only on unique constraint conflict
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				continue;
			}
			throw e;
		}
	}

	throw new AppError(400, 'Could not generate unique slug after multiple attempts');
}
