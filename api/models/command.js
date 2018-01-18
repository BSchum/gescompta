const mongoose = require('mongoose');
const ProductModel = require('./product.js');

var CommandModel = mongoose.Schema({
  productlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product',default: []}],
  commandId: Number,
  deleted:{
    type: Boolean,
    default: false
  },
  totalPrice: Number
});

CommandModel.methods.newCommand = function newCommand(newCommand, res){
  newCommand.save(function(err){
    if(err){
      res.json(err.message);
    }else{
      res.json("SUCCES");
    }
  });
}

CommandModel.statics.MaxIdIncremented = async function MaxIdIncremented(){
  var id;
  await this.findOne({}).sort({commandId: -1}).exec(function(err, docs){
    if(docs != null){
      id= docs.commandId+1;
    }else {
      id = 0;
    }
  });
  return id;
}
module.exports = mongoose.model('Command', CommandModel);
