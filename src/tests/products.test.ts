import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../app'; // Path to your Express app instance
import { Product } from '../interfaces/Product'; // Path to your Product interface
import productsData from '../database/products.json'; // To get actual count and valid SKU

const request = supertest(app);

describe('Product Routes', () => {
  it('GET /products should return an array of products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(productsData.length);

    if (response.body.length > 0) {
      const product = response.body[0] as Product;
      expect(product.SKU).toBeTypeOf('string');
      expect(product.title).toBeTypeOf('string');
      expect(product.type).toBeTypeOf('string');
      expect(product.description).toBeTypeOf('string');
      expect(product.filename).toBeTypeOf('string');
      expect(product.height).toBeTypeOf('number');
      expect(product.width).toBeTypeOf('number');
      expect(product.price).toBeTypeOf('number');
      expect(product.rating).toBeTypeOf('number');
    }
  });

  it('GET /products/:sku should return a single product or 404', async () => {
    // Test with an existing product SKU (e.g., from your products.json)
    // Ensure productsData is not empty before accessing its first element
    if (productsData.length === 0) {
        console.warn('Skipping GET /products/:sku test as products.json is empty.');
        return; // or use it.skip if preferred
    }
    const existingProductSKU = productsData[0].SKU;
    let response = await request.get(`/products/${existingProductSKU}`);

    const expectedProduct = (productsData as Product[]).find(p => p.SKU === existingProductSKU);

    if (expectedProduct) {
        expect(response.status).toBe(200);
        expect(response.body.SKU).toBe(existingProductSKU);
        expect(response.body.title).toBe(expectedProduct.title);
    } else {
        // This case indicates an issue with test data selection or API behavior
        console.warn(`Test Product with SKU ${existingProductSKU} not found in products.json. API might return 404.`);
        expect(response.status).toBe(404);
    }

    // Test with a non-existent product SKU
    const nonExistentProductSKU = "NON_EXISTENT_SKU_12345";
    response = await request.get(`/products/${nonExistentProductSKU}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Product Not Found 😢');
  });
});
