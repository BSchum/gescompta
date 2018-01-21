const router = require('express').Router();

router.use('/connect', require('./connect.js'));
router.use('/products', require('./product.js'));
router.use('/commands', require('./command.js'));
module.exports = router;
