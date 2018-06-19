var mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  email : {type:String , unique : true},
  password : {type:String},
  firstname: String,
  lastname: String,
  id_number: Number
});

var Instructor = mongoose.model ('instructor',instructorSchema);
module.exports = Instructor;
