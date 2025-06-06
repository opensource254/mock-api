"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest"); // beforeAll is not used in the example, so removed
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Path to your Express app instance
const users_json_1 = __importDefault(require("../database/users.json")); // To get actual count for one test
const request = (0, supertest_1.default)(app_1.default);
(0, vitest_1.describe)('User Routes', () => {
    (0, vitest_1.it)('GET /users should return an array of users', async () => {
        const response = await request.get('/users');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        // Check if the number of users returned matches the data
        (0, vitest_1.expect)(response.body.length).toBe(users_json_1.default.length);
        if (response.body.length > 0) {
            const user = response.body[0];
            (0, vitest_1.expect)(user.id).toBeTypeOf('number');
            (0, vitest_1.expect)(user.name).toBeTypeOf('string');
            (0, vitest_1.expect)(user.email).toBeTypeOf('string');
            // Add other checks as necessary based on the User interface
            (0, vitest_1.expect)(user.age).toBeTypeOf('number');
            (0, vitest_1.expect)(user.gender).toBeTypeOf('string');
            (0, vitest_1.expect)(user.company).toBeTypeOf('string');
            // 'picture' is optional in User interface, so check if present
            if (user.picture !== undefined) {
                (0, vitest_1.expect)(user.picture).toBeTypeOf('string');
            }
        }
    });
    (0, vitest_1.it)('GET /users/:userId should return a single user or 404', async () => {
        // Test with an existing user ID (e.g., from your users.json)
        const existingUserId = 1; // Assuming user with ID 1 exists
        let response = await request.get(`/users/${existingUserId}`);
        // Find the expected user from the data
        const expectedUser = users_json_1.default.find(u => u.id === existingUserId);
        if (expectedUser) {
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.id).toBe(existingUserId);
            (0, vitest_1.expect)(response.body.name).toBe(expectedUser.name);
            (0, vitest_1.expect)(response.body.email).toBe(expectedUser.email);
        }
        else {
            // This case should not happen if existingUserId is genuinely from users.json
            // but it's a safeguard or indicates an issue with test data assumption.
            console.warn(`Test User with ID ${existingUserId} not found in users.json. API might return 404.`);
            (0, vitest_1.expect)(response.status).toBe(404); // Or handle as per actual API behavior
        }
        // Test with a non-existent user ID
        const nonExistentUserId = 99999;
        response = await request.get(`/users/${nonExistentUserId}`);
        (0, vitest_1.expect)(response.status).toBe(404);
        // The actual message from users.ts is an object: { message: 'User Not Found' }
        (0, vitest_1.expect)(response.body.message).toBe('User Not Found');
    });
});
