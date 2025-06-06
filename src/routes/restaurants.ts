import express, { Request, Response, NextFunction, Router } from 'express';
import { Restaurant } from '../interfaces/Restaurant'; // Assuming interfaces are in src/interfaces
import restaurantsData from '../database/restaurants.json';

const router: Router = express.Router();

const restaurants: Restaurant[] = restaurantsData;

// GET Restaurants
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json(restaurants);
});

// GET a restaurant using restaurant_id (which is 'id' in the JSON)
router.get('/:restaurantId', (req: Request, res: Response, next: NextFunction) => {
    const restaurantId = req.params.restaurantId;

    const restaurant = restaurants.find(r => r.id === restaurantId);

    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant Not Found' });
        return;
    }
    res.json(restaurant);
});

export default router;
