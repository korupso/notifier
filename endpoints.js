const express = require('express');
const { createUser, getAllUsers, deleteUser } = require('./services/user.service');

var router = express.Router();

router.post('/users', (req, res, next) => {
    createUser(req.body.username, (err, user) => err ? next(err) : res.status(200).json(user));
});

router.get('/users', (req, res, next) => {
    getAllUsers((err, users) => err ? next(err) : res.status(200).json(users));
});

router.delete('/users/:idOrUsername', (req, res, next) => {
    deleteUser(req.params.idOrUsername, (err, user) => err ? next(err) : res.status(200).send("User " + user.username + " successfully deleted"));
});

module.exports = router;