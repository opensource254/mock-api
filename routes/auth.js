const router = require('express').Router();
const faker = require('faker');

router.post('/login', (req, res) => {
    let admin = {
        username: 'admin',
        password: 'admin'
    };

    let user = {
        username: 'user',
        password: 'user'
    };

    if (req.body.username === admin.username && req.body.password === admin.password) {
        // Create a fake user
        let user = {
            id: faker.datatype.uuid(),
            username: faker.internet.userName(),
            role: 'admin',
            token: faker.datatype.uuid(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        return res.json({ user });
    }

    if (req.body.username === user.username && req.body.password === user.password) {
        // Create a fake user
        let user = {
            id: faker.datatype.uuid(),
            username: faker.internet.userName(),
            role: 'user',
            token: faker.datatype.uuid(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        return res.json({ user });
    }

    res.status(401).json({
        message: 'Invalid Credentials'
    });
})

module.exports = router;