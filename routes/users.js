const express = require('express');
const router = express.Router();
const fs = require('fs')

/* GET users listing. */
router.get('/', function (req, res, next) {
 const users = fs.readFileSync('database/users.json')
 res.contentType('json')
  res.send(users)
});

module.exports = router;
