import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../app'; // Path to your Express app instance
import { User } from '../interfaces/User'; // For /me route response
import usersData from '../database/users.json'; // To get a valid user email for login

const request = supertest(app);

describe('Auth Routes', () => {
  // Ensure there's at least one user in users.json to test with
  const testUserEmail = usersData.length > 0 ? usersData[0].email : 'test@example.com';
  // If usersData is empty, login will fail, which is a valid test for that case.
  // Password can be anything for the mock login, as long as email is valid.
  const testUserPassword = 'password123';

  let authToken: string | null = null; // To store token for /me tests

  describe('POST /auth/login', () => {
    it('should return a JWT token for valid credentials', async () => {
      if (usersData.length === 0) {
        console.warn('Skipping login success test as users.json is empty.');
        return;
      }
      const response = await request.post('/auth/login').send({
        email: testUserEmail,
        password: testUserPassword,
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTypeOf('string');
      authToken = response.body.token; // Save token for subsequent tests
    });

    it('should return 400 if email is not provided', async () => {
        const response = await request.post('/auth/login').send({
          password: testUserPassword,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email is required');
      });

    it('should return 401 for invalid email', async () => {
      const response = await request.post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'somepassword',
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /auth/me', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request.get('/auth/me');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: No token provided');
    });

    it('should return 403 for an invalid/malformed token', async () => {
      const response = await request
        .get('/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden: Invalid or expired token');
    });

    it('should return user information for a valid token', async () => {
      // This test depends on authToken being set from a successful login
      if (!authToken) {
        console.warn('Skipping /auth/me test as no auth token was obtained from login.');
        // Optionally, force a login here if you want this test to be standalone
        // For now, we'll rely on the previous test setting authToken
        // To make it standalone:
        // const loginResponse = await request.post('/auth/login').send({ email: testUserEmail, password: testUserPassword });
        // if (loginResponse.body.token) authToken = loginResponse.body.token;
        // else throw new Error("Login failed, cannot proceed with /me test");
        expect.fail('Auth token not available for /me test. Ensure login test runs and succeeds first.');
      }

      const response = await request
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const userResponse = response.body as Partial<User>; // The /me route returns a subset of User
      expect(userResponse.email).toBe(testUserEmail);
      expect(userResponse.id).toBeTypeOf('number');
      // Check other properties returned by your /me route (e.g., name, company)
      if (usersData.length > 0 && usersData[0].email === testUserEmail) {
        expect(userResponse.name).toBe(usersData[0].name);
        expect(userResponse.company).toBe(usersData[0].company);
      }
    });
  });
});
