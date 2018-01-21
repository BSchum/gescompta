const router = require('express').Router();
var User = require('./../../../models/user.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.get('/', function(req, res){
  res.send("auth.js");
});
router.post('/create', async function(req, res){
  var password = await bcrypt.hashSync(req.body.password, 10);
  var newUser = new User({
    email: req.body.email,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    password: password,
    adress: req.body.adress,
    deleted: false
  });
  newUser.newUser(newUser, res);
});

router.post('/connect', function(req, res){
  User.findOne({
    email: req.body.email
  }, function(err, user){
    if(err) throw err;
    if(!user){
      res.status(401).json({
        message: 'Auth failed. User not found'
      });
    }else if(user){
      if(!user.comparePassword(req.body.password)){
        res.status(401).json({
          message: 'Auth failed. Wrong password'
        });
      }else{
        res.json({
          token: jwt.sign(
            { email: user.email,
              fullName: user.lastname+" "+user.firstname,
              _id: user._id}, 'RESTFULAPIs')
            });
          }
        }
      });
    });
    module.exports = router;
