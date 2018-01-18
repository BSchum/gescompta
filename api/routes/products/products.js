const router = require('express').Router();
var Product = require('./../../models/product.js');
router.get('/', function(req, res){
  res.send("products.js");
});

router.get('/', function(req, res){
  res.send("user.js");
});

router.post('/create', async function(req, res){
  var id = await Product.MaxIdIncremented();
  console.log('id : '+id);
  var newProduct = new Product({
    productid: id,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    deleted: false
  });
  newProduct.newProduct(newProduct, res);
});

router.get('/list', function(req, res){
  Product.find({deleted: false},function(err, posts){
    res.json(posts);
  })
});

router.put('/update', function(req, res){
  Product.update({_id:req.body.id},
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
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
    Product.update({_id: req.body.id}, {deleted: true}, function(err){
      if(err){
        res.json('FAIL'+err.message);
      }else{
        res.json('SUCCESS');
      }
    })
  });
  
  module.exports = router;
