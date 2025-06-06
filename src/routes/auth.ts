import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../interfaces/User'; // Assuming path is correct
import { JwtPayload } from '../interfaces/Auth'; // Assuming path is correct
import usersData from '../database/users.json';
import { authenticateToken } from '../middleware/auth'; // Import middleware

const router: Router = express.Router();
const SECRET_KEY = 'your-secret-key'; // Must be the same as in middleware

interface LoginRequestBody {
    email?: string;
    password?: string; // Password will be ignored for now as per mock logic
}

// Login Route
router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequestBody;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email in our "database"
    const user = (usersData as User[]).find(u => u.email === email);

    if (!user) {
        // Even if password check is mocked, we should check if user exists
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Mock password check: For now, if email exists, login is successful.
    // In a real app, you would compare `password` with a hashed user.password.

    const jwtPayload: JwtPayload = {
        id: user.id,
        email: user.email,
        // Add other minimal necessary details to payload
    };

    const token = jwt.sign(jwtPayload, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

// Protected Route - Get current user info
router.get('/me', authenticateToken, (req: Request, res: Response) => {
    // If authenticateToken middleware succeeds, req.user will be populated
    if (req.user) {
        // We can choose to return the full user object or select fields
        const { id, email, name, company } = req.user; // Example: return subset of user details
        res.json({ id, email, name, company });
    } else {
        // This case should ideally not be reached if middleware is correctly implemented
        // and req.user is always set on successful authentication.
        res.status(404).json({ message: 'User not found after authentication' });
    }
});

export default router;
