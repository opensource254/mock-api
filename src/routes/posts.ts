import express, { Request, Response, NextFunction, Router } from 'express';
import { Post } from '../interfaces/Post';
import postsData from '../database/posts.json';

const router: Router = express.Router();

// The posts.json is an array, so we type postsData as Post[]
const posts: Post[] = postsData;

/* GET posts listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json(posts);
});

/**
 * GET a post using post_id
 */
router.get('/:postId', (req: Request, res: Response, next: NextFunction) => {
  const postIdParam = req.params.postId;
  // Ensure postId is treated as a number for comparison
  const postId = parseInt(postIdParam, 10);

  if (isNaN(postId) || postId <= 0 || postId > posts.length) {
    // It's good practice to check if post ID is valid against the actual IDs if they are not sequential 1-based.
    // However, the current logic assumes sequential 1-based IDs corresponding to array indices.
    // For a more robust solution, one might find by actual ID: posts.find(p => p.id === postId);
    res.status(404).json({ message: 'Post Not Found' });
    return;
  }
  // Adjust for 0-based indexing as array access is 0-based and post IDs are typically 1-based
  const post = posts.find(p => p.id === postId);
  if (!post) {
    res.status(404).json({ message: 'Post Not Found' });
    return;
  }
  res.json(post);
});

export default router;
