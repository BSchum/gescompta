const router = require('express').Router();
const request = require('request');
router.post('/connection', function(req, res){
  var data = {email: req.body.email,
    password: req.body.password};
    request.post({
      headers: {'content-type':'application/json'},
      url:'http://localhost:3000/api/public/auth/connect',
      form:    data
    }, function(err, respond, body){
      body = JSON.parse(body);
      if(body.token){
        res.cookie('token' , "JWT "+body.token);
        res.redirect('/products');
      }else{
        res.render('connect.ejs')
      }
    });
  });
  
  router.get('/', function(req, res){
    if(req.cookies.token){
      res.redirect('/products');
    }else{
      res.render('connect.ejs');
    }
  });
  
  router.get('/register', function(req, res){
    res.render('register.ejs');
  });
  
  router.post('/register/connection', function(req, res){
    var data = {
      email: req.body.email,
      password: req.body.password,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      adress: req.body.adress
    };
    request.post({
      headers: {'content-type':'application/json'},
      url:'http://localhost:3000/api/public/auth/create',
      form:    data
    }, function(err, respond, body){
      body = JSON.parse(body);
      res.redirect('/connect');
    });
  });
  module.exports = router;
