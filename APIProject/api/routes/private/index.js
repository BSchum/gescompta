const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.use('/user', require('./user'));
router.use('/command', require('./command'));
router.use('/products', require('./products'));

module.exports = router;
