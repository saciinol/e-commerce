import { hash } from 'bcrypt';
import { prisma } from './prisma.js';

async function createSuperAdmin() {
	const hashed = await hash('strongpassword123', 12);

	await prisma.user.create({
		data: {
			email: 'superadmin@email.com',
			password: hashed,
			firstName: 'Super',
			lastName: 'Admin',
			role: 'SUPER_ADMIN',
		},
	});
}

// async function createCategory() {
// 	await prisma.category.create({
// 		data: {
// 			name: "Men's Clothing",
// 			slug: 'mens-clothing',
// 			description: 'Clothing and apparel for men',
// 			image: 'https://cdn.example.com/categories/mens-clothing.jpg',
// 			parentId: null,
// 			isActive: true,
// 			displayOrder: 1,
// 		},
// 	});
// }

createSuperAdmin().finally(async () => await prisma.$disconnect());
