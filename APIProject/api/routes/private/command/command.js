const router = require('express').Router();
const Command = require('./../../../models/command.js');
const Product = require('./../../../models/product.js');
const User = require('./../../../models/user.js');
const ObjectId = require('mongoose').Types.ObjectId;
const pdfkit = require('pdfkit');
const fs = require('fs');
router.get('/', function(req, res){
  res.send("command.js");
});

router.put('/create', async function(req, res){
  var id = await Command.MaxIdIncremented();
  User.findOne({_id: req.body.user._id}, function(err, user){
    var newCommand = new Command({
      commandId: id,
      totalPrice: 0,
      user: user
    });
    newCommand.save(function(err){
      if(err){
        res.json(err.message);
      }else{
        res.json(newCommand);
      }
    });
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
          Command.findOne({commandId: req.body.commandid} , function(err, command){
            res.json(command);
          }).populate({path: 'productlist', match: {deleted: false}});
        }
      });
    }
    
  });
});
router.put('/deleteAllProduct', function(req, res){
  Product.findOne({productid: req.body.productid}, function(err, product){
    Command.findOne({commandId: req.body.commandid}, function(err, command){
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

router.post('/listbyuser', function(req, res){
  Command.find({user: req.body.user._id, deleted: false}, function(err, commands){
    res.json(commands);
  })
  .populate({ path: 'productlist', match: {deleted: false}});
});

router.get('/list/:id', function(req, res){
  Command.findOne({commandId: req.params.id, deleted: false}, function(err, command){
    res.json(command);
  }).populate({ path: 'productlist user', match: {deleted: false}});
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

router.post('/facture', function(req, res){
  
  Command.findOne({commandId: req.body.commandid}, function(err, command){
    var pdf = new pdfkit;
    var userfullname = req.body.user.fullName.replace(' ', '-');
    pdf.pipe(fs.createWriteStream('pdfs/'+command.commandId+'-'+userfullname+'.pdf'));
    pdf.font('Times-Roman').fontSize(30).text('Facture', 250, 10);
    pdf.font('Times-Roman').fontSize(13).text('Adresse : ', 20,50);
    pdf.font('Times-Roman').fontSize(13).text(command.user.adress, 20,65);
    pdf.font('Times-Roman').fontSize(13).text(req.body.user.fullName, 20,80);
    var productheight = 180;
    pdf.font('Times-Roman').fontSize(13).text('Nom', 150,150);
    pdf.font('Times-Roman').fontSize(13).text('Prix TTC', 300,150);
    pdf.font('Times-Roman').fontSize(13).text('ID de produit', 60,150);
    pdf.font('Times-Roman').fontSize(13).text('dont TVA', 370,150);
    command.productlist.forEach(function(product){
      console.log(product);
      pdf.font('Times-Roman').fontSize(13).text(product.name, 150,productheight);
      pdf.font('Times-Roman').fontSize(13).text(product.price+'€', 300,productheight);
      pdf.font('Times-Roman').fontSize(13).text(product.productid, 60,productheight);
      pdf.font('Times-Roman').fontSize(13).text(product.tva, 370,productheight);
      productheight += 30;
    });
    pdf.font('Times-Roman').fontSize(13).text('Total: '+command.totalPrice+'€',265,productheight+30);
    
    pdf.end();
    res.json({url: 'http://'+process.env.HOST+':'+process.env.PORT+'/'+command.commandId+'-'+userfullname+'.pdf'});
    
  }).populate({path: 'user productlist'});
  
});

module.exports = router;
