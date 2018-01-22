const router = require('express').Router();

router.use('/connect', require('./connect.js'));
router.use('/products', require('./product.js'));
router.use('/order', require('./command.js'));
router.use('/cart', require('./cart.js'));

module.exports = router;
