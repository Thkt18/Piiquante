const express = require('express'); // import express
const router = express.Router(); // create a router

const userCtrl = require('../controllers/user'); // import the user controller


router.post('/signup', userCtrl.signup); // create a new user
router.post('/login', userCtrl.login); // login a user

module.exports = router; // export the router