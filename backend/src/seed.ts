import { hash } from 'bcrypt';
import { prisma } from './prisma.js';
import { Role } from '@prisma/client';

/*

npx prisma migrate reset
npx prisma migrate dev --name init

*/

async function main() {
	const hashed = await hash('123123123', 12);

	await prisma.user.create({
		data: {
			email: 'superadmin@email.com',
			password: hashed,
			firstName: 'Super',
			lastName: 'Admin',
			role: Role.SUPER_ADMIN,
      cart: {
					create: {},
				},
		},
	});

	await prisma.user.create({
		data: {
			email: 'admin@email.com',
			password: hashed,
			firstName: 'Admin',
			lastName: 'User',
			role: Role.ADMIN,
			emailVerified: true,
      cart: {
					create: {},
				},
		},
	});

	const customer = await prisma.user.create({
		data: {
			email: 'johndoe@email.com',
			password: hashed,
			firstName: 'John',
			lastName: 'Doe',
      cart: {
					create: {},
				},
		},
	});

	await prisma.address.create({
		data: {
			userId: customer.id,
			fullName: 'John Doe',
			phone: '09171234567',
			addressLine1: '123 Mabini St',
			city: 'Manila',
			province: 'Metro Manila',
			postalCode: '1000',
			isDefault: true,
		},
	});

	const electronics = await prisma.category.create({
		data: {
			name: 'Electronics',
			slug: 'electronics',
			description: 'Electronic devices and gadgets',
			displayOrder: 1,
		},
	});

	const smartphones = await prisma.category.create({
		data: {
			name: 'Smartphones',
			slug: 'smartphones',
			parentId: electronics.id,
			displayOrder: 1,
		},
	});

	const accessories = await prisma.category.create({
		data: {
			name: 'Accessories',
			slug: 'accessories',
			displayOrder: 2,
		},
	});

	await prisma.product.createMany({
		data: [
			// ======================
			// SMARTPHONES (15)
			// ======================
			{
				name: 'iPhone 15 Pro',
				slug: 'iphone-15-pro',
				sku: 'IP15PRO-256',
				price: 69990,
				comparePrice: 74990,
				cost: 62000,
				stock: 25,
				isFeatured: true,
				categoryId: smartphones.id,
				shortDescription: 'Apple iPhone 15 Pro 256GB',
			},
			{
				name: 'iPhone 15',
				slug: 'iphone-15',
				sku: 'IP15-128',
				price: 59990,
				stock: 40,
				categoryId: smartphones.id,
				shortDescription: 'Apple iPhone 15 128GB',
			},
			{
				name: 'Samsung Galaxy S24',
				slug: 'samsung-galaxy-s24',
				sku: 'SGS24-128',
				price: 54990,
				stock: 30,
				categoryId: smartphones.id,
				shortDescription: 'Samsung flagship smartphone',
			},
			{
				name: 'Samsung Galaxy S24 Ultra',
				slug: 'samsung-galaxy-s24-ultra',
				sku: 'SGS24U-256',
				price: 74990,
				stock: 20,
				categoryId: smartphones.id,
				shortDescription: 'Samsung Galaxy S24 Ultra 256GB',
			},
			{
				name: 'Google Pixel 8',
				slug: 'google-pixel-8',
				sku: 'PIX8-128',
				price: 49990,
				stock: 35,
				categoryId: smartphones.id,
				shortDescription: 'Google Pixel 8 smartphone',
			},
			{
				name: 'Google Pixel 8 Pro',
				slug: 'google-pixel-8-pro',
				sku: 'PIX8PRO-256',
				price: 64990,
				stock: 18,
				categoryId: smartphones.id,
				shortDescription: 'Google Pixel 8 Pro',
			},
			{
				name: 'Xiaomi 14',
				slug: 'xiaomi-14',
				sku: 'XM14-256',
				price: 39990,
				stock: 50,
				categoryId: smartphones.id,
				shortDescription: 'Xiaomi 14 flagship phone',
			},
			{
				name: 'Xiaomi Redmi Note 13',
				slug: 'xiaomi-redmi-note-13',
				sku: 'RMN13-128',
				price: 14990,
				stock: 80,
				categoryId: smartphones.id,
				shortDescription: 'Budget Redmi smartphone',
			},
			{
				name: 'OnePlus 12',
				slug: 'oneplus-12',
				sku: 'OP12-256',
				price: 47990,
				stock: 25,
				categoryId: smartphones.id,
				shortDescription: 'OnePlus flagship phone',
			},
			{
				name: 'Sony Xperia 1 V',
				slug: 'sony-xperia-1-v',
				sku: 'XP1V-256',
				price: 68990,
				stock: 10,
				categoryId: smartphones.id,
				shortDescription: 'Sony Xperia 1 V',
			},
			{
				name: 'Huawei P60 Pro',
				slug: 'huawei-p60-pro',
				sku: 'P60PRO-256',
				price: 52990,
				stock: 15,
				categoryId: smartphones.id,
				shortDescription: 'Huawei P60 Pro smartphone',
			},
			{
				name: 'Oppo Find X7',
				slug: 'oppo-find-x7',
				sku: 'OPFX7-256',
				price: 44990,
				stock: 22,
				categoryId: smartphones.id,
				shortDescription: 'Oppo Find X7 flagship',
			},
			{
				name: 'Vivo X100',
				slug: 'vivo-x100',
				sku: 'VIVOX100-256',
				price: 42990,
				stock: 28,
				categoryId: smartphones.id,
				shortDescription: 'Vivo X100 smartphone',
			},
			{
				name: 'Realme GT 5',
				slug: 'realme-gt-5',
				sku: 'RGT5-256',
				price: 31990,
				stock: 35,
				categoryId: smartphones.id,
				shortDescription: 'Realme GT performance phone',
			},
			{
				name: 'Asus ROG Phone 7',
				slug: 'asus-rog-phone-7',
				sku: 'ROG7-512',
				price: 79990,
				stock: 12,
				categoryId: smartphones.id,
				shortDescription: 'Gaming smartphone',
			},

			// ======================
			// ACCESSORIES (15)
			// ======================
			{
				name: 'USB-C Fast Charger 65W',
				slug: 'usb-c-fast-charger-65w',
				sku: 'CHARGER-USBC-65W',
				price: 1299,
				stock: 100,
				categoryId: accessories.id,
			},
			{
				name: 'USB-C Charging Cable',
				slug: 'usb-c-charging-cable',
				sku: 'CABLE-USBC-1M',
				price: 399,
				stock: 200,
				categoryId: accessories.id,
			},
			{
				name: 'Wireless Charging Pad',
				slug: 'wireless-charging-pad',
				sku: 'WIRELESS-CHARGER',
				price: 1899,
				stock: 60,
				categoryId: accessories.id,
			},
			{
				name: 'Bluetooth Earbuds',
				slug: 'bluetooth-earbuds',
				sku: 'BT-EARBUDS',
				price: 2499,
				stock: 70,
				categoryId: accessories.id,
			},
			{
				name: 'Phone Stand',
				slug: 'phone-stand',
				sku: 'PHONE-STAND',
				price: 299,
				stock: 150,
				categoryId: accessories.id,
			},
			{
				name: 'Screen Protector',
				slug: 'screen-protector',
				sku: 'SCREEN-GLASS',
				price: 199,
				stock: 300,
				categoryId: accessories.id,
			},
			{
				name: 'Phone Case – Clear',
				slug: 'phone-case-clear',
				sku: 'CASE-CLEAR',
				price: 499,
				stock: 120,
				categoryId: accessories.id,
			},
			{
				name: 'Phone Case – Rugged',
				slug: 'phone-case-rugged',
				sku: 'CASE-RUGGED',
				price: 799,
				stock: 90,
				categoryId: accessories.id,
			},
			{
				name: 'Car Phone Mount',
				slug: 'car-phone-mount',
				sku: 'CAR-MOUNT',
				price: 899,
				stock: 75,
				categoryId: accessories.id,
			},
			{
				name: 'Power Bank 20000mAh',
				slug: 'power-bank-20000mah',
				sku: 'PWRBANK-20K',
				price: 2499,
				stock: 65,
				categoryId: accessories.id,
			},
			{
				name: 'Wireless Mouse',
				slug: 'wireless-mouse',
				sku: 'MOUSE-WL',
				price: 999,
				stock: 80,
				categoryId: accessories.id,
			},
			{
				name: 'Bluetooth Keyboard',
				slug: 'bluetooth-keyboard',
				sku: 'KB-BT',
				price: 1799,
				stock: 45,
				categoryId: accessories.id,
			},
			{
				name: 'Laptop Sleeve',
				slug: 'laptop-sleeve',
				sku: 'SLEEVE-15',
				price: 1299,
				stock: 50,
				categoryId: accessories.id,
			},
			{
				name: 'Headphone Stand',
				slug: 'headphone-stand',
				sku: 'HEADPHONE-STAND',
				price: 699,
				stock: 40,
				categoryId: accessories.id,
			},
			{
				name: 'Cable Organizer',
				slug: 'cable-organizer',
				sku: 'CABLE-ORG',
				price: 249,
				stock: 180,
				categoryId: accessories.id,
			},
		],
	});
}

// async function createProductImage() {
//   await prisma.productImage.create({
//     data: {
//       productId: 1,
//       url: "/uploads/products/iphone-15-pro.jpg",
//       isDefault: true,
//     }
//   })

//   // await prisma.productImage.create({
//   //   data: {
//   //     productId: Number(req.params.id),
//   //     url: `/uploads/products/${req.file.filename}`,
//   //     isDefault: true,
//   //   },
//   // });
// }

main().finally(async () => await prisma.$disconnect());
