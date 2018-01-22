const router = require('express').Router();
const request = require('request');
//Final: Creer une commande, et y ajoute tout les produits commandé
router.get('/create', function(req, res){
  //Creer une commande
  request.put({
    headers: {'Authorization': req.cookies.token},
    url:'http://localhost:3000/api/private/command/create'
  }, function(err, respond, commandCreated){
    commandCreated = JSON.parse(commandCreated);
    
    var cart = JSON.parse(req.cookies.cart);
    var lastCommand;
    cart.forEach(function(product){
      var data = {
        commandid: commandCreated.commandId,
        productid: product.product.productid
      }
      request.put({
        headers: {'Authorization': req.cookies.token},
        url:'http://localhost:3000/api/private/command/addProduct',
        json: data
      }, function(error, commandWithAProduct){
        lastCommand = commandWithAProduct;
      });
    });
    res.clearCookie('cart');
    res.render('command.ejs', {command: lastCommand});
  });
});
module.exports = router;
