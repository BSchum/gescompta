const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/command', require('./command'));
router.use('/products', require('./products'));

module.exports = router;
