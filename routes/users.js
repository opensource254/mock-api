const express = require('express');
const router = express.Router();
const fs = require('fs')
const users = JSON.parse(fs.readFileSync('database/users.json', 'utf-8'))

/* GET users listing. */
router.get('/', function (req, res, _next) {
  res.json(users)
});

/**
 * GET a user using user_id
 */
router.get('/:user', (req, res, _next) => {
  const userId = req.params.user
  if (userId == 0 || userId > users.length) {
    res.status(404)
    res.json('User Not Found')
    return
  }
  res.json(users[userId - 1])

});

module.exports = router;
