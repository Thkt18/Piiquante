const express = require('express'); // import express
const router = express.Router(); // create a router
const max = require('../middleware/limit'); // import the limit middleware
const password = require('../middleware/password'); // import the password middleware
const userCtrl = require('../controllers/user'); // import the user controller


router.post('/signup', password, userCtrl.signup); // create a new user
router.post('/login',max.apiLimit, userCtrl.login); // login a user


module.exports = router; // export the router