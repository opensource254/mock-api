"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_json_1 = __importDefault(require("../database/users.json"));
const auth_1 = require("../middleware/auth"); // Import middleware
const router = express_1.default.Router();
const SECRET_KEY = 'your-secret-key'; // Must be the same as in middleware
// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    // Find user by email in our "database"
    const user = users_json_1.default.find(u => u.email === email);
    if (!user) {
        // Even if password check is mocked, we should check if user exists
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Mock password check: For now, if email exists, login is successful.
    // In a real app, you would compare `password` with a hashed user.password.
    const jwtPayload = {
        id: user.id,
        email: user.email,
        // Add other minimal necessary details to payload
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});
// Protected Route - Get current user info
router.get('/me', auth_1.authenticateToken, (req, res) => {
    // If authenticateToken middleware succeeds, req.user will be populated
    if (req.user) {
        // We can choose to return the full user object or select fields
        const { id, email, name, company } = req.user; // Example: return subset of user details
        res.json({ id, email, name, company });
    }
    else {
        // This case should ideally not be reached if middleware is correctly implemented
        // and req.user is always set on successful authentication.
        res.status(404).json({ message: 'User not found after authentication' });
    }
});
exports.default = router;
