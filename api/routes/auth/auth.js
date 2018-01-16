const router = require('express').Router();

router.get('/', function(req, res){
  res.send("auth.js");
});

module.exports = router;
