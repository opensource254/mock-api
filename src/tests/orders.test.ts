import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../app'; // Path to your Express app instance
import { Order, OrderItem } from '../interfaces/Order'; // Path to your Order interface
import ordersData from '../database/orders.json'; // To get actual count and valid IDs
import usersData from '../database/users.json'; // To get a valid userId for testing

const request = supertest(app);

describe('Order Routes', () => {
  it('GET /orders should return an array of orders', async () => {
    const response = await request.get('/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(ordersData.length);

    if (response.body.length > 0) {
      const order = response.body[0] as Order;
      expect(order.id).toBeTypeOf('string');
      expect(order.userId).toBeTypeOf('string');
      expect(Array.isArray(order.items)).toBe(true);
      expect(order.orderDate).toBeTypeOf('string'); // ISO Date String
      expect(['pending', 'shipped', 'delivered', 'cancelled'].includes(order.status)).toBe(true);
      expect(order.totalAmount).toBeTypeOf('number');

      if (order.items.length > 0) {
        const item = order.items[0] as OrderItem;
        expect(item.productId).toBeTypeOf('string');
        expect(item.quantity).toBeTypeOf('number');
        expect(item.pricePerUnit).toBeTypeOf('number');
      }
    }
  });

  it('GET /orders/:id should return a single order or 404', async () => {
    if (ordersData.length === 0) {
      console.warn('Skipping GET /orders/:id test as orders.json is empty.');
      return;
    }
    const existingOrderId = ordersData[0].id;
    let response = await request.get(`/orders/${existingOrderId}`);

    const expectedOrder = (ordersData as Order[]).find(o => o.id === existingOrderId);

    if (expectedOrder) {
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(existingOrderId);
      expect(response.body.userId).toBe(expectedOrder.userId);
    } else {
      console.warn(`Test Order with ID ${existingOrderId} not found in orders.json.`);
      expect(response.status).toBe(404);
    }

    const nonExistentOrderId = 'non-existent-uuid-order';
    response = await request.get(`/orders/${nonExistentOrderId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Order not found');
  });

  it('GET /orders/user/:userId should return orders for a user or an empty array', async () => {
    if (usersData.length === 0) {
        console.warn('Skipping GET /orders/user/:userId test as users.json is empty.');
        return;
    }
    // Assuming the first user in users.json might have orders.
    // Order.userId is string, User.id is number. Route expects string userId.
    const targetUserId = String(usersData[0].id);

    const response = await request.get(`/orders/user/${targetUserId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Verify that all returned orders actually belong to the targetUser
    const userOrdersFromData = (ordersData as Order[]).filter(o => o.userId === targetUserId);
    expect(response.body.length).toBe(userOrdersFromData.length);

    response.body.forEach((order: Order) => {
        expect(order.userId).toBe(targetUserId);
    });

    // Test with a userId that likely has no orders
    const userIdWithNoOrders = 'user-id-with-no-orders-for-orders-999';
    const noOrderResponse = await request.get(`/orders/user/${userIdWithNoOrders}`);
    expect(noOrderResponse.status).toBe(200);
    expect(Array.isArray(noOrderResponse.body)).toBe(true);
    expect(noOrderResponse.body.length).toBe(0);
  });
});
