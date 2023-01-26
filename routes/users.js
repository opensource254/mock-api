const express = require("express");
const router = express.Router();
const { uuid } = require("uuidv4");
const { faker } = require("@faker-js/faker");

const fs = require("fs");
const users = JSON.parse(fs.readFileSync("database/users.json", "utf-8"));
const redis = require("../lib/redis");

/* GET users listing. */
router.get("/", function (req, res, _next) {
  const users = [];
  for (let id = 1; id <= 10; id++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email();
    users.push({
      id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
    });
  }

  const sessionId = uuid();
  redis.set(sessionId, JSON.stringify(users));
  res.cookie("sessionId", sessionId);
  res.json(users);
});

/**
 * GET a user using user_id
 */
router.get("/:user", (req, res, _next) => {
  const userId = req.params.user;
  if (userId == 0 || userId > users.length) {
    res.status(404);
    res.json("User Not Found");
    return;
  }
  res.json(users[userId - 1]);
});

module.exports = router;
