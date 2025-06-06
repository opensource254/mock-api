import express, { Request, Response, Router } from 'express';
import { Order } from '../interfaces/Order'; // Adjust path if your structure differs
import ordersData from '../database/orders.json';

const router: Router = express.Router();

// GET all orders
router.get('/', (req: Request, res: Response) => {
  const orders: Order[] = ordersData as Order[];
  res.json(orders);
});

// GET an order by its ID
router.get('/:id', (req: Request, res: Response) => {
  const orderId = req.params.id;
  const order = (ordersData as Order[]).find(o => o.id === orderId);

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// GET orders by userId
router.get('/user/:userId', (req: Request, res: Response) => {
    const targetUserId = req.params.userId;
    // Ensure comparison is consistent (Order.userId is string, User.id might be number)
    const userOrders = (ordersData as Order[]).filter(o => o.userId === targetUserId);

    if (userOrders.length > 0) {
        res.json(userOrders);
    } else {
        // Not an error if a user has no orders, just an empty result.
        res.json([]);
    }
});

export default router;
