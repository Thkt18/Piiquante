
const express = require('express'); // import the express module
const router = express.Router(); // create a router

const auth = require('../middleware/auth'); // import the auth middleware
const multer = require('../middleware/multer-config'); // import the multer middleware

const sauceCtrl = require('../controllers/sauce'); // import the sauce controller

router.get('/', auth, sauceCtrl.getAllSauce); // get all sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // create a sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // get one sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // modify a sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // delete a sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce); // like or dislike a sauce

module.exports = router; // export the router