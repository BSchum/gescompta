const mongoose = require('mongoose');
var product = mongoose.Schema({
  productid: {
    type: Number,
    unique: true,
  },
  name: String,
  price: Number,
  description: String
  
});
module.exports = mongoose.model('Product', product);
