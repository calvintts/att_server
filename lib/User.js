var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email : {type:String , unique : true},
  password : {type:String},
  firstname: String,
  lastname: String,
  id_number: Number
});

var User = mongoose.model ('user',userSchema);
module.exports = User;
