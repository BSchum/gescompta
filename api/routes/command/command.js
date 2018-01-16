const router = require('express').Router();

router.get('/', function(req, res){
  res.send("command.js");
});

module.exports = router;
