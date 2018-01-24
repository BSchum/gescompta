const router = require('express').Router();
const request = require('request');
//Final: Creer une commande, et y ajoute tout les produits commandé
router.get('/create', function(req, res){
  //Creer une commande
  request.put({
    headers: {'Authorization': req.cookies.token},
    url:'http://localhost:3000/api/private/command/create'
  }, async function(err, respond, commandCreated){
    commandCreated = JSON.parse(commandCreated);
    var cart = JSON.parse(req.cookies.cart);
    await cart.forEach(function(product){
      var data = {
        commandid: commandCreated.commandId,
        productid: product.product.productid
      }
      request.put({
        headers: {'Authorization': req.cookies.token},
        url:'http://localhost:3000/api/private/command/addProduct',
        json: data
      });
    });
    
    res.clearCookie('cart');
    res.redirect('/order/view/'+commandCreated.commandId);
  });
});
router.get('/view/:id', function(req, res){
  var commandid = {
    commandid : req.params.id
  }
  request.post({
    headers: {'Authorization': req.cookies.token},
    url:'http://localhost:3000/api/private/command/facture',
    json: commandid
  }, function(err, url){
    if(err){
      console.log(err);
    }
    else{
      console.log('url');
      console.log(url);
    }
  });
  
  var urlAPI = 'http://localhost:3000/api/private/command/list/'+req.params.id
  request.get({
    headers: {'Authorization': req.cookies.token},
    url: urlAPI
  }, function(err, respond, command){
    command = JSON.parse(command);
    var url = 'http://localhost:3000/'+req.params.id+'-'+command.user.lastname+'-'+command.user.firstname+'.pdf';
    res.render('command.ejs', {command: command, fileUrl: url});
  });
});

router.get('/list', function(req, res){
  request.post({
    headers: {'Authorization': req.cookies.token},
    url: 'http://localhost:3000/api/private/command/listbyuser'
  }, function(err, respond, commands){
    commands = JSON.parse(commands);
    res.render('commandlist.ejs', {commands: commands});
  });
});
module.exports = router;
