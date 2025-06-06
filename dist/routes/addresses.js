"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addresses_json_1 = __importDefault(require("../database/addresses.json"));
const router = express_1.default.Router();
// GET all addresses
router.get('/', (req, res) => {
    const addresses = addresses_json_1.default;
    res.json(addresses);
});
// GET an address by its ID
router.get('/:id', (req, res) => {
    const addressId = req.params.id;
    const address = addresses_json_1.default.find(a => a.id === addressId);
    if (address) {
        res.json(address);
    }
    else {
        res.status(404).json({ message: 'Address not found' });
    }
});
// GET addresses by userId (optional)
router.get('/user/:userId', (req, res) => {
    const targetUserId = req.params.userId;
    // Ensure comparison is consistent (e.g. if User.id is number, userId in Address is string)
    const userAddresses = addresses_json_1.default.filter(a => a.userId === targetUserId);
    if (userAddresses.length > 0) {
        res.json(userAddresses);
    }
    else {
        // It's not an error if a user has no addresses, just an empty result.
        // Could also return 404 if user ID itself is considered non-existent,
        // but that requires checking against usersData. For now, just return empty array.
        res.json([]);
    }
});
exports.default = router;
