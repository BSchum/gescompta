const router = require('express').Router();

router.get('/', function(req, res){
  res.send("user.js");
});

module.exports = router;
