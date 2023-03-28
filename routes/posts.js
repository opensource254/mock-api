const express = require('express')
const router = express.Router()
const fs = require('fs')
const posts = JSON.parse(fs.readFileSync('database/posts.json', 'utf-8'))

/* GET posts listing. */
router.get('/', function (req, res) {
	res.json(posts)
})

/**
 * GET a post using post_id
 */
router.get('/:post', (req, res) => {
	const postId = req.params.post
	if (postId == 0 || postId > posts.length) {
		res.status(404)
		res.json('post Not Found')
		return
	}
	res.json(posts[postId - 1])

})

module.exports = router
