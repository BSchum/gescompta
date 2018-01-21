const router = require('express').Router();
const jwt = require('jsonwebtoken');


router.use('/auth', require('./auth'));



module.exports = router;
