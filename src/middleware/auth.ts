import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/Auth'; // Adjust path as necessary
import { User } from '../interfaces/User'; // Adjust path as necessary
import usersData from '../database/users.json';

const SECRET_KEY = 'your-secret-key'; // Keep this consistent and secure in a real app

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors | null, decodedPayload: string | jwt.JwtPayload | undefined) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }

    // Ensure decodedPayload is not undefined and is an object before asserting type
    if (!decodedPayload || typeof decodedPayload === 'string') {
      return res.status(403).json({ message: 'Forbidden: Invalid token payload' });
    }

    const payload = decodedPayload as JwtPayload;

    // Find user in our "database" based on payload
    const user = (usersData as User[]).find(u => u.id === payload.id && u.email === payload.email);

    if (!user) {
      return res.status(403).json({ message: 'Forbidden: User not found for token credentials' });
    }

    req.user = user; // Attach user to request object
    next();
  });
};
