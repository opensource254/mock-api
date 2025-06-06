"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_json_1 = __importDefault(require("../database/users.json"));
const router = express_1.default.Router();
// The users.json is an array, so we type usersData as User[]
const users = users_json_1.default;
/* GET users listing. */
router.get('/', (req, res, next) => {
    res.json(users);
});
/**
 * GET a user using user_id
 */
router.get('/:userId', (req, res, next) => {
    const userIdParam = req.params.userId;
    // Ensure userId is treated as a number for comparison, especially if it comes from a URL param
    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User Not Found' });
    }
    res.json(user);
});
exports.default = router;
