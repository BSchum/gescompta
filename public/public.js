const router = require('express').Router();

router.get('/', function(req, res){
  res.send("products.js");
});

module.exports = router;
