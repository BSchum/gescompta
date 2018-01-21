const router = require('express').Router();
const request = require('request');

router.get('/:id', function(req, res){
  request.post({
    headers: {'Authorization': req.cookies.token},
    url:'http://localhost:3000/api/private/command/create'
  }, function(err, res, body){
    request.post({
      headers: {'Authorization': req.cookies.token},
      url:'http://localhost:3000/api/private/command/addProduct'}, function(err, res, body){
        //TODO send data to push product in command
      });
    });
  });
  module.exports = router;
