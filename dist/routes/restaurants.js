"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurants_json_1 = __importDefault(require("../database/restaurants.json"));
const router = express_1.default.Router();
const restaurants = restaurants_json_1.default;
// GET Restaurants
router.get('/', (req, res, next) => {
    res.json(restaurants);
});
// GET a restaurant using restaurant_id (which is 'id' in the JSON)
router.get('/:restaurantId', (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant Not Found' });
        return;
    }
    res.json(restaurant);
});
exports.default = router;
