const Redis = require("ioredis");

const redisUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL
    : process.env.REDIS_TLS_URL;

const redis = new Redis(redisUrl);

redis.on("error", (error) => console.log(error));

redis.on("connect", () => console.log("Connected to redis"));

module.exports = redis;
