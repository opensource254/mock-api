"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Path to your Express app instance
const addresses_json_1 = __importDefault(require("../database/addresses.json")); // To get actual count and valid IDs
const users_json_1 = __importDefault(require("../database/users.json")); // To get a valid userId for testing
const request = (0, supertest_1.default)(app_1.default);
(0, vitest_1.describe)('Address Routes', () => {
    (0, vitest_1.it)('GET /addresses should return an array of addresses', async () => {
        const response = await request.get('/addresses');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, vitest_1.expect)(response.body.length).toBe(addresses_json_1.default.length);
        if (response.body.length > 0) {
            const address = response.body[0];
            (0, vitest_1.expect)(address.id).toBeTypeOf('string');
            (0, vitest_1.expect)(address.street).toBeTypeOf('string');
            (0, vitest_1.expect)(address.city).toBeTypeOf('string');
            (0, vitest_1.expect)(address.zipCode).toBeTypeOf('string');
            (0, vitest_1.expect)(address.country).toBeTypeOf('string');
            if (address.userId !== undefined) {
                (0, vitest_1.expect)(address.userId).toBeTypeOf('string');
            }
        }
    });
    (0, vitest_1.it)('GET /addresses/:id should return a single address or 404', async () => {
        if (addresses_json_1.default.length === 0) {
            console.warn('Skipping GET /addresses/:id test as addresses.json is empty.');
            return;
        }
        const existingAddressId = addresses_json_1.default[0].id;
        let response = await request.get(`/addresses/${existingAddressId}`);
        const expectedAddress = addresses_json_1.default.find(a => a.id === existingAddressId);
        if (expectedAddress) {
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.id).toBe(existingAddressId);
            (0, vitest_1.expect)(response.body.street).toBe(expectedAddress.street);
        }
        else {
            console.warn(`Test Address with ID ${existingAddressId} not found in addresses.json.`);
            (0, vitest_1.expect)(response.status).toBe(404);
        }
        const nonExistentAddressId = 'non-existent-uuid-address';
        response = await request.get(`/addresses/${nonExistentAddressId}`);
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.message).toBe('Address not found');
    });
    (0, vitest_1.it)('GET /addresses/user/:userId should return addresses for a user or an empty array', async () => {
        if (users_json_1.default.length === 0) {
            console.warn('Skipping GET /addresses/user/:userId test as users.json is empty.');
            return;
        }
        // Assuming the first user in users.json might have addresses.
        // Address.userId is string, User.id is number. The route expects string userId.
        const targetUserId = String(users_json_1.default[0].id);
        const response = await request.get(`/addresses/user/${targetUserId}`);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        // Verify that all returned addresses actually belong to the targetUser
        const userAddressesFromData = addresses_json_1.default.filter(a => a.userId === targetUserId);
        (0, vitest_1.expect)(response.body.length).toBe(userAddressesFromData.length);
        response.body.forEach((address) => {
            (0, vitest_1.expect)(address.userId).toBe(targetUserId);
        });
        // Test with a userId that likely has no addresses
        const userIdWithNoAddresses = 'user-id-with-no-addresses-999';
        const noAddressResponse = await request.get(`/addresses/user/${userIdWithNoAddresses}`);
        (0, vitest_1.expect)(noAddressResponse.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(noAddressResponse.body)).toBe(true);
        (0, vitest_1.expect)(noAddressResponse.body.length).toBe(0);
    });
});
