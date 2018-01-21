const router = require('express').Router();
const Command = require('./../../../models/command.js');
const Product = require('./../../../models/product.js');
const User = require('./../../../models/user.js');
const ObjectId = require('mongoose').Types.ObjectId;
router.get('/', function(req, res){
  res.send("command.js");
});

router.get('/create', async function(req, res){
  var id = await Command.MaxIdIncremented();
  var newCommand = new Command({
    commandId: id,
    totalPrice: 0
  });
  User.findOneAndUpdate({_id: req.body.user._id}, {$push: {commands: newCommand}}, function(err, user){
    if(err){
      res.json(err);
    }
  });
  newCommand.save(function(err){
    if(err){
      res.json(err.message);
    }else{
      res.json(newCommand);
    }
  });
});

router.put('/addProduct', function(req, res){
  Product.findOne({productid: req.body.productid}, function(err, product){
    if(err){
      res.json(err);
    }
    else{
      Command.findOneAndUpdate({commandId: req.body.commandid},{$push: {productlist: product}, $inc:{ totalPrice: product.price}}, function(err, command){
        if(err){
          res.json(err);
        }
        else{
          res.json('success');
        }
      });
    }
    
  });
});
router.put('/deleteAllProduct', function(req, res){
  Product.findOne({productid: req.body.productid}, function(err, product){
    Command.findOne({commandId: req.body.commandid}, function(err, command){
      console.log(product);
      console.log(command);
      
      Command.update({_id: command._id}, {$pullAll: {productlist: [product]}}, function(err){
        if(err){
          res.json(err);
        }else{
          res.json('success');
        }
      });
    });
  });
});
router.put('/deleteProduct', function(req, res){
  Product.findOne({productid: req.body.productid}, function(err, product){
    if(err){
      res.json(err);
    }else{
      if(product!=null){
        Command.findOne({commandId: req.body.commandid}, function(err, command){
          command.totalPrice -= product.price;
          if(command!= null){
            var index = 0;
            while(command.productlist[index].toString() != product._id.toString() && index < command.productlist.length-1){
              console.log(index);
              index++;
            }
            if(command.productlist[index].toString() == product._id.toString()){
              command.productlist.splice(index, 1);
            }
            command.save(function(err){
              if(err){
                res.json(err);
              }else{
                res.json('success');
              }
            });
          }
          else{
            res.json('This command doesnt exist');
          }
        });
      }
      else{
        res.json('This product doesnt exist');
      }
    }
  });
});
router.get('/list', function(req, res){
  Command.find({deleted: false}, function(err, commands){
    res.json(commands);
  })
  .populate({ path: 'productlist', match: {deleted: false}});
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
