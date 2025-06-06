import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../app';
import { Company } from '../interfaces/Company';
import companiesData from '../database/companies.json'; // To get a valid ID for testing

const request = supertest(app);

describe('Company Routes', () => {
  it('GET /companies should return an array of companies', async () => {
    const response = await request.get('/companies');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Check if the number of companies returned matches the data
    expect(response.body.length).toBe(companiesData.length);

    if (response.body.length > 0) {
      const company = response.body[0] as Company;
      expect(company.id).toBeTypeOf('string');
      expect(company.name).toBeTypeOf('string');
      expect(company.slogan).toBeTypeOf('string');
      expect(company.industry).toBeTypeOf('string');
      expect(company.address).toBeTypeOf('string');
    }
  });

  it('GET /companies/:id should return a single company or 404', async () => {
    if (companiesData.length === 0) {
      // Skip test if no company data exists for reliable ID
      console.warn('Skipping company GET /:id test as no company data found in companies.json.');
      // Vitest doesn't have a direct skip, but you can use `it.skip` or conditional logic.
      // For now, just return to effectively skip the assertions if data is missing.
      return;
    }
    const existingCompanyId = companiesData[0].id;
    let response = await request.get(`/companies/${existingCompanyId}`);

    const expectedCompany = (companiesData as Company[]).find(c => c.id === existingCompanyId);

    if (expectedCompany) {
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(existingCompanyId);
        expect(response.body.name).toBe(expectedCompany.name);
    } else {
        // This case should not happen if existingCompanyId is from companies.json
        console.warn(`Test Company with ID ${existingCompanyId} not found in companies.json. API might return 404.`);
        expect(response.status).toBe(404);
    }

    const nonExistentId = 'non-existent-uuid-12345';
    response = await request.get(`/companies/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Company not found');
  });
});
