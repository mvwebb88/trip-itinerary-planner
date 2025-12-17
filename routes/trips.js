const express = require('express');
const router = express.Router();

const isSignedIn = require('../middleware/isSignedIn');
const tripsController = require('../controllers/trips');

router.get('/', isSignedIn, tripsController.index);
router.get('/new', isSignedIn, tripsController.new);
router.post('/', isSignedIn, tripsController.create);

module.exports = router;
