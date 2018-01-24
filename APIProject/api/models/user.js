const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  console.log(newUser.password);
  newUser.save(function(err){
    if(err){
      res.json(err.message);
    }else{
      res.json("SUCCES");
    }
  });
}
UserModel.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', UserModel);
