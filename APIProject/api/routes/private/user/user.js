const router = require('express').Router();
var User = require('./../../../models/user.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.get('/', function(req, res){
  res.send("user.js");
});



router.get('/list', function(req, res){
  User.find({deleted: false},function(err, users){
    res.json(users);
  });
});

router.put('/update', function(req, res){
  User.update({_id:req.body.id},
    {
      email: req.body.email,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      password: bcrypt.hashSync(req.body.password, 10),
      adress: req.body.adress
    },
    function(err){
      if(err){
        res.json(err.message);
      }else{
        res.json('updated');
      }
    });
  });
  
  router.delete('/delete', function(req, res){
    User.update({_id: req.body.id}, {deleted: true}, function(err){
      if(err){
        res.json('FAIL'+err.message);
      }else{
        res.json('SUCCESS');
      }
    })
  });
  
  
  module.exports = router;
