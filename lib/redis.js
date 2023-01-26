const Redis = require("ioredis");

const redis = new Redis({
  host: "HOST",
  port: PORT,
  password: "password",
});

redis.on("error", (error) => console.log(error));

redis.on("connect", () => console.log("Connected to redis"));

module.exports = redis;
