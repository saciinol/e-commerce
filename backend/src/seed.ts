import { hash } from 'bcrypt';
import { prisma } from './prisma.js';

async function createAdmin() {
	const hashed = await hash('strongpassword123', 12);

	await prisma.user.create({
		data: {
			email: 'admin@email.com',
			password: hashed,
			firstName: 'Admin',
			lastName: 'Account',
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

createAdmin().finally(async () => await prisma.$disconnect());
