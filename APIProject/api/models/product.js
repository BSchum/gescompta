const mongoose = require('mongoose');
var ProductModel = mongoose.Schema({
  productid: {
    type: Number,
    unique: true,
  },
  name:
  {
    type: String,
    unique: true
  },
  price: {
    type: Number,
    default: 0
  },
  tva: Number,
  description: String,
  deleted: Boolean
});

ProductModel.statics.MaxIdIncremented = async function MaxIdIncremented(){
  var id;
  await this.findOne({}).sort({productid: -1}).exec(function(err, docs){
    console.log(docs);
    if(docs != null){
      id= docs.productid+1;
    }else {
      id = 0;
    }
  });
  return id;
}
ProductModel.methods.newProduct = function newProduct(newProduct, res){
  newProduct.save(function(err){
    if(err){
      res.json(err.message);
    }else{
      res.json("SUCCES");
    }
  });
}
module.exports = mongoose.model('Product', ProductModel);
