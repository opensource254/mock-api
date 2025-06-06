import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../app'; // Path to your Express app instance
import { Address } from '../interfaces/Address'; // Path to your Address interface
import addressesData from '../database/addresses.json'; // To get actual count and valid IDs
import usersData from '../database/users.json'; // To get a valid userId for testing

const request = supertest(app);

describe('Address Routes', () => {
  it('GET /addresses should return an array of addresses', async () => {
    const response = await request.get('/addresses');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(addressesData.length);

    if (response.body.length > 0) {
      const address = response.body[0] as Address;
      expect(address.id).toBeTypeOf('string');
      expect(address.street).toBeTypeOf('string');
      expect(address.city).toBeTypeOf('string');
      expect(address.zipCode).toBeTypeOf('string');
      expect(address.country).toBeTypeOf('string');
      if (address.userId !== undefined) {
        expect(address.userId).toBeTypeOf('string');
      }
    }
  });

  it('GET /addresses/:id should return a single address or 404', async () => {
    if (addressesData.length === 0) {
      console.warn('Skipping GET /addresses/:id test as addresses.json is empty.');
      return;
    }
    const existingAddressId = addressesData[0].id;
    let response = await request.get(`/addresses/${existingAddressId}`);

    const expectedAddress = (addressesData as Address[]).find(a => a.id === existingAddressId);

    if (expectedAddress) {
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(existingAddressId);
      expect(response.body.street).toBe(expectedAddress.street);
    } else {
      console.warn(`Test Address with ID ${existingAddressId} not found in addresses.json.`);
      expect(response.status).toBe(404);
    }

    const nonExistentAddressId = 'non-existent-uuid-address';
    response = await request.get(`/addresses/${nonExistentAddressId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Address not found');
  });

  it('GET /addresses/user/:userId should return addresses for a user or an empty array', async () => {
    if (usersData.length === 0) {
        console.warn('Skipping GET /addresses/user/:userId test as users.json is empty.');
        return;
    }
    // Assuming the first user in users.json might have addresses.
    // Address.userId is string, User.id is number. The route expects string userId.
    const targetUserId = String(usersData[0].id);

    const response = await request.get(`/addresses/user/${targetUserId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Verify that all returned addresses actually belong to the targetUser
    const userAddressesFromData = (addressesData as Address[]).filter(a => a.userId === targetUserId);
    expect(response.body.length).toBe(userAddressesFromData.length);

    response.body.forEach((address: Address) => {
        expect(address.userId).toBe(targetUserId);
    });

    // Test with a userId that likely has no addresses
    const userIdWithNoAddresses = 'user-id-with-no-addresses-999';
    const noAddressResponse = await request.get(`/addresses/user/${userIdWithNoAddresses}`);
    expect(noAddressResponse.status).toBe(200);
    expect(Array.isArray(noAddressResponse.body)).toBe(true);
    expect(noAddressResponse.body.length).toBe(0);
  });
});
