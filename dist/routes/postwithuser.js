"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_json_1 = __importDefault(require("../database/posts.json"));
const users_json_1 = __importDefault(require("../database/users.json"));
const router = express_1.default.Router();
const posts = posts_json_1.default;
const users = users_json_1.default;
/* Placeholder for GET / - The old route sent a 404 message.
   This could be changed to list all posts with their users, but that might be data-intensive.
   For now, keeping similar behavior or providing a more informative message.
*/
router.get('/', (req, res, next) => {
    // res.status(400).json({ message: 'Please provide a post ID in the URL, e.g., /postwithuser/1' });
    // Alternatively, fetch all posts with users (can be large)
    const allPostsWithUsers = posts.map(post => {
        const user = users.find(u => u.id === post.user_id);
        return { ...post, user };
    });
    res.json(allPostsWithUsers);
});
/**
 * GET post with user data using post_id
 */
router.get('/:postId', (req, res, next) => {
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
    const postWithUserData = { ...post, user };
    res.json(postWithUserData);
});
exports.default = router;
