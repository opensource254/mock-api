"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const companies_json_1 = __importDefault(require("../database/companies.json")); // To get a valid ID for testing
const request = (0, supertest_1.default)(app_1.default);
(0, vitest_1.describe)('Company Routes', () => {
    (0, vitest_1.it)('GET /companies should return an array of companies', async () => {
        const response = await request.get('/companies');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        // Check if the number of companies returned matches the data
        (0, vitest_1.expect)(response.body.length).toBe(companies_json_1.default.length);
        if (response.body.length > 0) {
            const company = response.body[0];
            (0, vitest_1.expect)(company.id).toBeTypeOf('string');
            (0, vitest_1.expect)(company.name).toBeTypeOf('string');
            (0, vitest_1.expect)(company.slogan).toBeTypeOf('string');
            (0, vitest_1.expect)(company.industry).toBeTypeOf('string');
            (0, vitest_1.expect)(company.address).toBeTypeOf('string');
        }
    });
    (0, vitest_1.it)('GET /companies/:id should return a single company or 404', async () => {
        if (companies_json_1.default.length === 0) {
            // Skip test if no company data exists for reliable ID
            console.warn('Skipping company GET /:id test as no company data found in companies.json.');
            // Vitest doesn't have a direct skip, but you can use `it.skip` or conditional logic.
            // For now, just return to effectively skip the assertions if data is missing.
            return;
        }
        const existingCompanyId = companies_json_1.default[0].id;
        let response = await request.get(`/companies/${existingCompanyId}`);
        const expectedCompany = companies_json_1.default.find(c => c.id === existingCompanyId);
        if (expectedCompany) {
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.id).toBe(existingCompanyId);
            (0, vitest_1.expect)(response.body.name).toBe(expectedCompany.name);
        }
        else {
            // This case should not happen if existingCompanyId is from companies.json
            console.warn(`Test Company with ID ${existingCompanyId} not found in companies.json. API might return 404.`);
            (0, vitest_1.expect)(response.status).toBe(404);
        }
        const nonExistentId = 'non-existent-uuid-12345';
        response = await request.get(`/companies/${nonExistentId}`);
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.message).toBe('Company not found');
    });
});
