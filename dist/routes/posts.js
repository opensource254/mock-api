"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_json_1 = __importDefault(require("../database/posts.json"));
const router = express_1.default.Router();
// The posts.json is an array, so we type postsData as Post[]
const posts = posts_json_1.default;
/* GET posts listing. */
router.get('/', (req, res, next) => {
    res.json(posts);
});
/**
 * GET a post using post_id
 */
router.get('/:postId', (req, res, next) => {
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
exports.default = router;
