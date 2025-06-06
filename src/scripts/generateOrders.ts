import { Faker, en } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { Order, OrderItem, OrderStatus } from '../interfaces/Order';
import { User } from '../interfaces/User';
import { Product } from '../interfaces/Product';

// Load existing data
import usersData from '../database/users.json';
import productsData from '../database/products.json';

const faker = new Faker({ locale: [en] });

const existingUsers: User[] = usersData as User[];
const existingProducts: Product[] = productsData as Product[];

const generateMockOrders = (count: number): Order[] => {
  const orders: Order[] = [];
  const orderStatuses: OrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled'];

  if (existingUsers.length === 0) {
    console.warn("No users found in users.json. Cannot generate orders linked to users.");
    return [];
  }
  if (existingProducts.length === 0) {
    console.warn("No products found in products.json. Cannot generate orders with products.");
    return [];
  }

  for (let i = 0; i < count; i++) {
    const user = existingUsers[faker.number.int({ min: 0, max: existingUsers.length - 1 })];

    const numItems = faker.number.int({ min: 1, max: 5 });
    const items: OrderItem[] = [];
    let totalAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const product = existingProducts[faker.number.int({ min: 0, max: existingProducts.length - 1 })];
      const quantity = faker.number.int({ min: 1, max: 3 });
      // Price per unit should be product.price, but ensure product and product.price exist
      const pricePerUnit = product && typeof product.price === 'number' ? product.price : faker.commerce.price({min: 10, max:200, dec:2, symbol:''});


      items.push({
        productId: product.SKU, // Using SKU as productId
        quantity,
        pricePerUnit: parseFloat(pricePerUnit.toString()), // ensure number
      });
      totalAmount += quantity * parseFloat(pricePerUnit.toString());
    }

    orders.push({
      id: faker.string.uuid(),
      userId: String(user.id), // User.id is number, ensure string for Order.userId
      items,
      orderDate: faker.date.past({ years: 1 }).toISOString(),
      status: orderStatuses[faker.number.int({ min: 0, max: orderStatuses.length - 1 })],
      totalAmount: parseFloat(totalAmount.toFixed(2)), // Ensure 2 decimal places
    });
  }
  return orders;
};

const ordersData = generateMockOrders(30); // Generate 30 orders
const outputDir = path.join(__dirname, '..', 'database');

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const filePath = path.join(outputDir, 'orders.json');

fs.writeFileSync(filePath, JSON.stringify(ordersData, null, 2));
console.log(`Successfully generated ${ordersData.length} orders to ${filePath}`);
