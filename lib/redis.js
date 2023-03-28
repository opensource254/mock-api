const Redis = require('ioredis')

const redisUrl =
	process.env.NODE_ENV === 'production'
		? process.env.REDIS_URL
		: process.env.REDIS_TLS_URL

const redis = new Redis(redisUrl)

redis.on('error', (error) => {
	throw error
})

module.exports = redis
