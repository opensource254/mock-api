"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Path to your Express app instance
const users_json_1 = __importDefault(require("../database/users.json")); // To get a valid user email for login
const request = (0, supertest_1.default)(app_1.default);
(0, vitest_1.describe)('Auth Routes', () => {
    // Ensure there's at least one user in users.json to test with
    const testUserEmail = users_json_1.default.length > 0 ? users_json_1.default[0].email : 'test@example.com';
    // If usersData is empty, login will fail, which is a valid test for that case.
    // Password can be anything for the mock login, as long as email is valid.
    const testUserPassword = 'password123';
    let authToken = null; // To store token for /me tests
    (0, vitest_1.describe)('POST /auth/login', () => {
        (0, vitest_1.it)('should return a JWT token for valid credentials', async () => {
            if (users_json_1.default.length === 0) {
                console.warn('Skipping login success test as users.json is empty.');
                return;
            }
            const response = await request.post('/auth/login').send({
                email: testUserEmail,
                password: testUserPassword,
            });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toHaveProperty('token');
            (0, vitest_1.expect)(response.body.token).toBeTypeOf('string');
            authToken = response.body.token; // Save token for subsequent tests
        });
        (0, vitest_1.it)('should return 400 if email is not provided', async () => {
            const response = await request.post('/auth/login').send({
                password: testUserPassword,
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.message).toBe('Email is required');
        });
        (0, vitest_1.it)('should return 401 for invalid email', async () => {
            const response = await request.post('/auth/login').send({
                email: 'nonexistent@example.com',
                password: 'somepassword',
            });
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body.message).toBe('Invalid email or password');
        });
    });
    (0, vitest_1.describe)('GET /auth/me', () => {
        (0, vitest_1.it)('should return 401 if no token is provided', async () => {
            const response = await request.get('/auth/me');
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body.message).toBe('Unauthorized: No token provided');
        });
        (0, vitest_1.it)('should return 403 for an invalid/malformed token', async () => {
            const response = await request
                .get('/auth/me')
                .set('Authorization', 'Bearer invalidtoken123');
            (0, vitest_1.expect)(response.status).toBe(403);
            (0, vitest_1.expect)(response.body.message).toBe('Forbidden: Invalid or expired token');
        });
        (0, vitest_1.it)('should return user information for a valid token', async () => {
            // This test depends on authToken being set from a successful login
            if (!authToken) {
                console.warn('Skipping /auth/me test as no auth token was obtained from login.');
                // Optionally, force a login here if you want this test to be standalone
                // For now, we'll rely on the previous test setting authToken
                // To make it standalone:
                // const loginResponse = await request.post('/auth/login').send({ email: testUserEmail, password: testUserPassword });
                // if (loginResponse.body.token) authToken = loginResponse.body.token;
                // else throw new Error("Login failed, cannot proceed with /me test");
                vitest_1.expect.fail('Auth token not available for /me test. Ensure login test runs and succeeds first.');
            }
            const response = await request
                .get('/auth/me')
                .set('Authorization', `Bearer ${authToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            const userResponse = response.body; // The /me route returns a subset of User
            (0, vitest_1.expect)(userResponse.email).toBe(testUserEmail);
            (0, vitest_1.expect)(userResponse.id).toBeTypeOf('number');
            // Check other properties returned by your /me route (e.g., name, company)
            if (users_json_1.default.length > 0 && users_json_1.default[0].email === testUserEmail) {
                (0, vitest_1.expect)(userResponse.name).toBe(users_json_1.default[0].name);
                (0, vitest_1.expect)(userResponse.company).toBe(users_json_1.default[0].company);
            }
        });
    });
});
