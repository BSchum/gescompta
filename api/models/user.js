const mongoose = require('mongoose');
var user = mongoose.Schema({
  email: {
    type: String,
    index: {
      unique: true
    }
  },
  lastname: String,
  firstname: String,
  password: String,
  adress: String
});
module.exports = mongoose.model('User', user);
