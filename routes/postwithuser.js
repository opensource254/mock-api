const express = require('express');
const router = express.Router();
const { faker } = require("@faker-js/faker");

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
    let posts = []
    const postsInSession = req.session.postsWithUser
    if (postsInSession) {
        posts = postsInSession
    } else {
        for (let index = 0; index < 20; index++) {
            const userId = faker.random.numeric()
            posts.push({
                "user_id": userId,
                "id": index+1,
                "title": faker.lorem.sentence,
                "body": faker.lorem.paragraphs(),
                "user": {
                    id: userId,
                    name: faker.name.fullName(),
                    gender: faker.name.sex(),
                    createdAt: faker.date.past()
                }
            })
        }
        req.session.postsWithUser = posts
    }
    res.json(posts)

});


module.exports = router;
