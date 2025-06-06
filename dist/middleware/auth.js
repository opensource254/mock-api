"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_json_1 = __importDefault(require("../database/users.json"));
const SECRET_KEY = 'your-secret-key'; // Keep this consistent and secure in a real app
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decodedPayload) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }
        // Ensure decodedPayload is not undefined and is an object before asserting type
        if (!decodedPayload || typeof decodedPayload === 'string') {
            return res.status(403).json({ message: 'Forbidden: Invalid token payload' });
        }
        const payload = decodedPayload;
        // Find user in our "database" based on payload
        const user = users_json_1.default.find(u => u.id === payload.id && u.email === payload.email);
        if (!user) {
            return res.status(403).json({ message: 'Forbidden: User not found for token credentials' });
        }
        req.user = user; // Attach user to request object
        next();
    });
};
exports.authenticateToken = authenticateToken;
