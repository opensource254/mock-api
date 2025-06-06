"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load existing data
const users_json_1 = __importDefault(require("../database/users.json"));
const products_json_1 = __importDefault(require("../database/products.json"));
const faker = new faker_1.Faker({ locale: [faker_1.en] });
const existingUsers = users_json_1.default;
const existingProducts = products_json_1.default;
const generateMockOrders = (count) => {
    const orders = [];
    const orderStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
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
        const items = [];
        let totalAmount = 0;
        for (let j = 0; j < numItems; j++) {
            const product = existingProducts[faker.number.int({ min: 0, max: existingProducts.length - 1 })];
            const quantity = faker.number.int({ min: 1, max: 3 });
            // Price per unit should be product.price, but ensure product and product.price exist
            const pricePerUnit = product && typeof product.price === 'number' ? product.price : faker.commerce.price({ min: 10, max: 200, dec: 2, symbol: '' });
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
const outputDir = path_1.default.join(__dirname, '..', 'database');
// Ensure the directory exists
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir, { recursive: true });
}
const filePath = path_1.default.join(outputDir, 'orders.json');
fs_1.default.writeFileSync(filePath, JSON.stringify(ordersData, null, 2));
console.log(`Successfully generated ${ordersData.length} orders to ${filePath}`);
