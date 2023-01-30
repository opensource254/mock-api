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
  for (let id = 1; id <= 100; id++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email();
    let gender = faker.name.gender();
    let career = faker.name.jobTitle();

    users.push({
      id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      gender: gender,
      career: career,
    });
  }

  const sessionId = uuid();
  redis.set(sessionId, JSON.stringify(users));
  res.cookie("sessionId", sessionId);
  res.json(users);
});

router.get("/:user", (req, res, _next) => {
  const sessionId = req.cookies.sessionId;

  redis.get(sessionId, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const users = JSON.parse(result);

      const user = users.find((u) => u.id === parseInt(req.params.user));
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    }
  });
});

module.exports = router;
