import { describe, it, expect } from 'vitest'; // beforeAll is not used in the example, so removed
import supertest from 'supertest';
import app from '../app'; // Path to your Express app instance
import { User } from '../interfaces/User'; // Path to your User interface
import usersData from '../database/users.json'; // To get actual count for one test

const request = supertest(app);

describe('User Routes', () => {
  it('GET /users should return an array of users', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Check if the number of users returned matches the data
    expect(response.body.length).toBe(usersData.length);

    if (response.body.length > 0) {
      const user = response.body[0] as User;
      expect(user.id).toBeTypeOf('number');
      expect(user.name).toBeTypeOf('string');
      expect(user.email).toBeTypeOf('string');
      // Add other checks as necessary based on the User interface
      expect(user.age).toBeTypeOf('number');
      expect(user.gender).toBeTypeOf('string');
      expect(user.company).toBeTypeOf('string');
      // 'picture' is optional in User interface, so check if present
      if (user.picture !== undefined) {
        expect(user.picture).toBeTypeOf('string');
      }
    }
  });

  it('GET /users/:userId should return a single user or 404', async () => {
    // Test with an existing user ID (e.g., from your users.json)
    const existingUserId = 1; // Assuming user with ID 1 exists
    let response = await request.get(`/users/${existingUserId}`);

    // Find the expected user from the data
    const expectedUser = (usersData as User[]).find(u => u.id === existingUserId);

    if (expectedUser) {
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(existingUserId);
        expect(response.body.name).toBe(expectedUser.name);
        expect(response.body.email).toBe(expectedUser.email);
    } else {
        // This case should not happen if existingUserId is genuinely from users.json
        // but it's a safeguard or indicates an issue with test data assumption.
        console.warn(`Test User with ID ${existingUserId} not found in users.json. API might return 404.`);
        expect(response.status).toBe(404); // Or handle as per actual API behavior
    }


    // Test with a non-existent user ID
    const nonExistentUserId = 99999;
    response = await request.get(`/users/${nonExistentUserId}`);
    expect(response.status).toBe(404);
    // The actual message from users.ts is an object: { message: 'User Not Found' }
    expect(response.body.message).toBe('User Not Found');
  });
});
