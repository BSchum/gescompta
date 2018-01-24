const router = require('express').Router();
const request = require('request');
router.use(function(req, res, next){
  if(req.cookies.token){
    next();
  }else{
    res.redirect('/connect');
  }
});

router.get('/', function(req, res){
  request.get({
    url:'http://localhost:3000/api/private/products/list',
    headers:{
      Authorization: req.cookies.token
    }
  },
  function(err, respond, body){
    
    body = JSON.parse(body);
    res.render('product.ejs', {products: body});
  });
});

router.get('/:id', function(req, res){
  request.get({
    url:'http://localhost:3000/api/private/products/list/'+req.params.id,
    headers:{
      Authorization: req.cookies.token
    }
  }, function(err, respond, body){
    body = JSON.parse(body);
    res.render('singleproduct.ejs', {product: body});
  });
});
module.exports = router;
