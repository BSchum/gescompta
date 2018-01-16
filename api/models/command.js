const mongoose = require('mongoose');
var user = mongoose.Schema({
  productlist: [{type: moogoose.Schema.Types.ObjectId, ref: 'Product',default: []}]
});
module.exports = mongoose.model('Command', command);
