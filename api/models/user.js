const mongoose = require('mongoose');
var UserModel = mongoose.Schema({
  email: {
    type: String,
    index: {
      unique: true
    }
  },
  lastname: String,
  firstname: String,
  password: String,
  adress: String,
  deleted: Boolean
});

UserModel.methods.newUser = function newUser(newUser, res){
  newUser.save(function(err){
    if(err){
      res.json(err.message);
    }else{
      res.json("SUCCES");
    }
  });
}

module.exports = mongoose.model('User', UserModel);
