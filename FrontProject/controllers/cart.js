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
  if(req.cookies.cart){
    cart = JSON.parse(req.cookies.cart);
  }else{
    cart = "Pas de produit";
  }
  if(cart !== "Pas de produit"){
    var products = [];
    var occurences = [];
    var actualValue = cart[0];
    products.push(actualValue);
    var i = 0;
    cart.sort(function(a, b){
      var comparison;
      if (a.product.productid > b.product.productid) {
        comparison = 1;
      } else if (b.product.productid > a.product.productid) {
        comparison = -1;
      }else{
        comparison = 0;
      }
      return comparison;
    });
    
    for(c = 0; c < cart.length; c++){
      if(cart[c].product._id == actualValue.product._id){
        i++;
      }else{
        occurences.push(i);
        products.push(cart[c]);
        i = 1;
        actualValue = cart[c];
      }
    }
    occurences.push(i);
  }
  res.render('cart.ejs', {products: products, occurences: occurences});
});
router.get('/clear', function(req, res){
  res.clearCookie('cart');
  res.clearCookie('token');
  res.json('clear');
});

router.get('/addProduct/:id', function(req, res){
  request.get({
    headers: {'Authorization': req.cookies.token},
    url:'http://localhost:3000/api/private/products/list/'+req.params.id
  }, function(err, respond, product){
    product = JSON.parse(product);
    if(product._id)
    {
      if(!req.cookies.cart){
        var cart = [{product}];
        cart = JSON.stringify(cart);
        res.cookie('cart', cart);
      }
      else{
        var cart = req.cookies.cart;
        cart = JSON.parse(cart);
        cart.push({product: product});
        cart = JSON.stringify(cart);
        res.cookie('cart', cart);
      }
      res.redirect('/cart');
    }
  });
});

router.get('/deleteProduct/:id', function(req, res){
  var cart = JSON.parse(req.cookies.cart);
  var i =0;
  var deleted = false;
  cart.forEach(function(product){
    if(product.product.productid == req.params.id && !deleted){
      deleted = true;
      cart.splice(i, 1);
    }
    i++;
  });
  res.cookie('cart', JSON.stringify(cart));
  res.redirect('/cart');
});

module.exports = router;
