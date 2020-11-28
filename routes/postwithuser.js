const express = require('express');
const router = express.Router();
const fs = require('fs')
const posts = JSON.parse(fs.readFileSync('database/posts.json', 'utf-8'))
const users = JSON.parse(fs.readFileSync('database/users.json', 'utf-8'))

router.get('/', function (req, res, _next) {
    res.status(404)
    res.json('Add post id to your request - /postwithuser/:id')
    return
});

/**
 * GET post with user data using post_id
 */
router.get('/:post', (req, res, _next) => {
    const postId = req.params.post
    if (postId == 0 || postId > posts.length) {
        res.status(404)
        res.json('post Not Found')
        return
    }
    const postWithUserData = posts[postId - 1]

    const userId = posts[postId - 1].user_id
    if (userId == 0 || userId > users.length) {
        res.status(404)
        res.json('User Not Found')
        return
    }

    postWithUserData.user_data = users[userId - 1]
    res.json(postWithUserData)

});


module.exports = router;
