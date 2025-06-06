import express, { Request, Response, NextFunction, Router } from 'express';
import { User } from '../interfaces/User';
import usersData from '../database/users.json';
import path from 'path'; // Not strictly necessary for direct JSON import but good for general path use

const router: Router = express.Router();

// The users.json is an array, so we type usersData as User[]
const users: User[] = usersData;

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json(users);
});

/**
 * GET a user using user_id
 */
router.get('/:userId', (req: Request, res: Response, next: NextFunction) => {
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

export default router;
