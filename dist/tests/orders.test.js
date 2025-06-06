"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Path to your Express app instance
const orders_json_1 = __importDefault(require("../database/orders.json")); // To get actual count and valid IDs
const users_json_1 = __importDefault(require("../database/users.json")); // To get a valid userId for testing
const request = (0, supertest_1.default)(app_1.default);
(0, vitest_1.describe)('Order Routes', () => {
    (0, vitest_1.it)('GET /orders should return an array of orders', async () => {
        const response = await request.get('/orders');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, vitest_1.expect)(response.body.length).toBe(orders_json_1.default.length);
        if (response.body.length > 0) {
            const order = response.body[0];
            (0, vitest_1.expect)(order.id).toBeTypeOf('string');
            (0, vitest_1.expect)(order.userId).toBeTypeOf('string');
            (0, vitest_1.expect)(Array.isArray(order.items)).toBe(true);
            (0, vitest_1.expect)(order.orderDate).toBeTypeOf('string'); // ISO Date String
            (0, vitest_1.expect)(['pending', 'shipped', 'delivered', 'cancelled'].includes(order.status)).toBe(true);
            (0, vitest_1.expect)(order.totalAmount).toBeTypeOf('number');
            if (order.items.length > 0) {
                const item = order.items[0];
                (0, vitest_1.expect)(item.productId).toBeTypeOf('string');
                (0, vitest_1.expect)(item.quantity).toBeTypeOf('number');
                (0, vitest_1.expect)(item.pricePerUnit).toBeTypeOf('number');
            }
        }
    });
    (0, vitest_1.it)('GET /orders/:id should return a single order or 404', async () => {
        if (orders_json_1.default.length === 0) {
            console.warn('Skipping GET /orders/:id test as orders.json is empty.');
            return;
        }
        const existingOrderId = orders_json_1.default[0].id;
        let response = await request.get(`/orders/${existingOrderId}`);
        const expectedOrder = orders_json_1.default.find(o => o.id === existingOrderId);
        if (expectedOrder) {
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.id).toBe(existingOrderId);
            (0, vitest_1.expect)(response.body.userId).toBe(expectedOrder.userId);
        }
        else {
            console.warn(`Test Order with ID ${existingOrderId} not found in orders.json.`);
            (0, vitest_1.expect)(response.status).toBe(404);
        }
        const nonExistentOrderId = 'non-existent-uuid-order';
        response = await request.get(`/orders/${nonExistentOrderId}`);
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.message).toBe('Order not found');
    });
    (0, vitest_1.it)('GET /orders/user/:userId should return orders for a user or an empty array', async () => {
        if (users_json_1.default.length === 0) {
            console.warn('Skipping GET /orders/user/:userId test as users.json is empty.');
            return;
        }
        // Assuming the first user in users.json might have orders.
        // Order.userId is string, User.id is number. Route expects string userId.
        const targetUserId = String(users_json_1.default[0].id);
        const response = await request.get(`/orders/user/${targetUserId}`);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        // Verify that all returned orders actually belong to the targetUser
        const userOrdersFromData = orders_json_1.default.filter(o => o.userId === targetUserId);
        (0, vitest_1.expect)(response.body.length).toBe(userOrdersFromData.length);
        response.body.forEach((order) => {
            (0, vitest_1.expect)(order.userId).toBe(targetUserId);
        });
        // Test with a userId that likely has no orders
        const userIdWithNoOrders = 'user-id-with-no-orders-for-orders-999';
        const noOrderResponse = await request.get(`/orders/user/${userIdWithNoOrders}`);
        (0, vitest_1.expect)(noOrderResponse.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(noOrderResponse.body)).toBe(true);
        (0, vitest_1.expect)(noOrderResponse.body.length).toBe(0);
    });
});
