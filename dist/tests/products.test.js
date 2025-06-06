"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Path to your Express app instance
const products_json_1 = __importDefault(require("../database/products.json")); // To get actual count and valid SKU
const request = (0, supertest_1.default)(app_1.default);
(0, vitest_1.describe)('Product Routes', () => {
    (0, vitest_1.it)('GET /products should return an array of products', async () => {
        const response = await request.get('/products');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, vitest_1.expect)(response.body.length).toBe(products_json_1.default.length);
        if (response.body.length > 0) {
            const product = response.body[0];
            (0, vitest_1.expect)(product.SKU).toBeTypeOf('string');
            (0, vitest_1.expect)(product.title).toBeTypeOf('string');
            (0, vitest_1.expect)(product.type).toBeTypeOf('string');
            (0, vitest_1.expect)(product.description).toBeTypeOf('string');
            (0, vitest_1.expect)(product.filename).toBeTypeOf('string');
            (0, vitest_1.expect)(product.height).toBeTypeOf('number');
            (0, vitest_1.expect)(product.width).toBeTypeOf('number');
            (0, vitest_1.expect)(product.price).toBeTypeOf('number');
            (0, vitest_1.expect)(product.rating).toBeTypeOf('number');
        }
    });
    (0, vitest_1.it)('GET /products/:sku should return a single product or 404', async () => {
        // Test with an existing product SKU (e.g., from your products.json)
        // Ensure productsData is not empty before accessing its first element
        if (products_json_1.default.length === 0) {
            console.warn('Skipping GET /products/:sku test as products.json is empty.');
            return; // or use it.skip if preferred
        }
        const existingProductSKU = products_json_1.default[0].SKU;
        let response = await request.get(`/products/${existingProductSKU}`);
        const expectedProduct = products_json_1.default.find(p => p.SKU === existingProductSKU);
        if (expectedProduct) {
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.SKU).toBe(existingProductSKU);
            (0, vitest_1.expect)(response.body.title).toBe(expectedProduct.title);
        }
        else {
            // This case indicates an issue with test data selection or API behavior
            console.warn(`Test Product with SKU ${existingProductSKU} not found in products.json. API might return 404.`);
            (0, vitest_1.expect)(response.status).toBe(404);
        }
        // Test with a non-existent product SKU
        const nonExistentProductSKU = "NON_EXISTENT_SKU_12345";
        response = await request.get(`/products/${nonExistentProductSKU}`);
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.message).toBe('Product Not Found 😢');
    });
});
