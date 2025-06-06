import express, { Request, Response, NextFunction, Router } from 'express';
import { Post } from '../interfaces/Post';
import { User } from '../interfaces/User';
import postsData from '../database/posts.json';
import usersData from '../database/users.json';

const router: Router = express.Router();

const posts: Post[] = postsData;
const users: User[] = usersData;

// Define a combined interface
interface PostWithUser extends Post {
  user?: User; // User might not be found, making it optional
}

/* Placeholder for GET / - The old route sent a 404 message.
   This could be changed to list all posts with their users, but that might be data-intensive.
   For now, keeping similar behavior or providing a more informative message.
*/
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  // res.status(400).json({ message: 'Please provide a post ID in the URL, e.g., /postwithuser/1' });
  // Alternatively, fetch all posts with users (can be large)
  const allPostsWithUsers: PostWithUser[] = posts.map(post => {
    const user = users.find(u => u.id === post.user_id);
    return { ...post, user };
  });
  res.json(allPostsWithUsers);
});

/**
 * GET post with user data using post_id
 */
router.get('/:postId', (req: Request, res: Response, next: NextFunction) => {
  const postIdParam = req.params.postId;
  const postId = parseInt(postIdParam, 10);

  if (isNaN(postId)) {
    res.status(400).json({ message: 'Invalid Post ID format' });
    return;
  }

  const post = posts.find(p => p.id === postId);

  if (!post) {
    res.status(404).json({ message: 'Post Not Found' });
    return;
  }

  const user = users.find(u => u.id === post.user_id);

  // If user is not found, we can decide to return the post without user data
  // or return a specific message. Here, we include the post and undefined for user.
  const postWithUserData: PostWithUser = { ...post, user };

  res.json(postWithUserData);
});

export default router;
