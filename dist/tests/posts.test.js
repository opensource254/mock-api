"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Path to your Express app instance
const posts_json_1 = __importDefault(require("../database/posts.json")); // To get actual count and valid ID
const request = (0, supertest_1.default)(app_1.default);
(0, vitest_1.describe)('Post Routes', () => {
    (0, vitest_1.it)('GET /posts should return an array of posts', async () => {
        const response = await request.get('/posts');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, vitest_1.expect)(response.body.length).toBe(posts_json_1.default.length);
        if (response.body.length > 0) {
            const post = response.body[0];
            (0, vitest_1.expect)(post.id).toBeTypeOf('number');
            (0, vitest_1.expect)(post.user_id).toBeTypeOf('number');
            (0, vitest_1.expect)(post.title).toBeTypeOf('string');
            (0, vitest_1.expect)(post.body).toBeTypeOf('string');
        }
    });
    (0, vitest_1.it)('GET /posts/:postId should return a single post or 404', async () => {
        // Test with an existing post ID (e.g., from your posts.json)
        const existingPostId = 1; // Assuming post with ID 1 exists
        let response = await request.get(`/posts/${existingPostId}`);
        const expectedPost = posts_json_1.default.find(p => p.id === existingPostId);
        if (expectedPost) {
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.id).toBe(existingPostId);
            (0, vitest_1.expect)(response.body.title).toBe(expectedPost.title);
        }
        else {
            console.warn(`Test Post with ID ${existingPostId} not found in posts.json. API might return 404.`);
            (0, vitest_1.expect)(response.status).toBe(404);
        }
        // Test with a non-existent post ID
        const nonExistentPostId = 99999; // A very large ID not expected to exist
        response = await request.get(`/posts/${nonExistentPostId}`);
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.message).toBe('Post Not Found');
    });
});
