import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../app'; // Path to your Express app instance
import { Post } from '../interfaces/Post'; // Path to your Post interface
import postsData from '../database/posts.json'; // To get actual count and valid ID

const request = supertest(app);

describe('Post Routes', () => {
  it('GET /posts should return an array of posts', async () => {
    const response = await request.get('/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(postsData.length);

    if (response.body.length > 0) {
      const post = response.body[0] as Post;
      expect(post.id).toBeTypeOf('number');
      expect(post.user_id).toBeTypeOf('number');
      expect(post.title).toBeTypeOf('string');
      expect(post.body).toBeTypeOf('string');
    }
  });

  it('GET /posts/:postId should return a single post or 404', async () => {
    // Test with an existing post ID (e.g., from your posts.json)
    const existingPostId = 1; // Assuming post with ID 1 exists
    let response = await request.get(`/posts/${existingPostId}`);

    const expectedPost = (postsData as Post[]).find(p => p.id === existingPostId);

    if (expectedPost) {
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(existingPostId);
        expect(response.body.title).toBe(expectedPost.title);
    } else {
        console.warn(`Test Post with ID ${existingPostId} not found in posts.json. API might return 404.`);
        expect(response.status).toBe(404);
    }

    // Test with a non-existent post ID
    const nonExistentPostId = 99999; // A very large ID not expected to exist
    response = await request.get(`/posts/${nonExistentPostId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Post Not Found');
  });
});
