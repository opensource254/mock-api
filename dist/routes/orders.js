"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_json_1 = __importDefault(require("../database/orders.json"));
const router = express_1.default.Router();
// GET all orders
router.get('/', (req, res) => {
    const orders = orders_json_1.default;
    res.json(orders);
});
// GET an order by its ID
router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    const order = orders_json_1.default.find(o => o.id === orderId);
    if (order) {
        res.json(order);
    }
    else {
        res.status(404).json({ message: 'Order not found' });
    }
});
// GET orders by userId
router.get('/user/:userId', (req, res) => {
    const targetUserId = req.params.userId;
    // Ensure comparison is consistent (Order.userId is string, User.id might be number)
    const userOrders = orders_json_1.default.filter(o => o.userId === targetUserId);
    if (userOrders.length > 0) {
        res.json(userOrders);
    }
    else {
        // Not an error if a user has no orders, just an empty result.
        res.json([]);
    }
});
exports.default = router;
