import express, { Request, Response, Router } from 'express';
import { Address } from '../interfaces/Address'; // Adjust path if your structure differs
import addressesData from '../database/addresses.json';

const router: Router = express.Router();

// GET all addresses
router.get('/', (req: Request, res: Response) => {
  const addresses: Address[] = addressesData as Address[];
  res.json(addresses);
});

// GET an address by its ID
router.get('/:id', (req: Request, res: Response) => {
  const addressId = req.params.id;
  const address = (addressesData as Address[]).find(a => a.id === addressId);

  if (address) {
    res.json(address);
  } else {
    res.status(404).json({ message: 'Address not found' });
  }
});

// GET addresses by userId (optional)
router.get('/user/:userId', (req: Request, res: Response) => {
    const targetUserId = req.params.userId;
    // Ensure comparison is consistent (e.g. if User.id is number, userId in Address is string)
    const userAddresses = (addressesData as Address[]).filter(a => a.userId === targetUserId);

    if (userAddresses.length > 0) {
        res.json(userAddresses);
    } else {
        // It's not an error if a user has no addresses, just an empty result.
        // Could also return 404 if user ID itself is considered non-existent,
        // but that requires checking against usersData. For now, just return empty array.
        res.json([]);
    }
});

export default router;
