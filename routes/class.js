var express = require('express');
var router = express.Router();
var Class = require('../models/class');
var mongoose = require('mongoose');
var moment = require('moment');

//start the db for attendance
router.post('/start',function(req,res)
{
  var location = req.body.location;
  var classDay = moment().month()+1 + '/' + moment().date() + '/' + moment().year();
  console.log(classDay);
  var newClass = new Class();
  newClass.classNumber = req.body.classNumber;
  newClass.classDay = classDay;
  newClass.location = location;
  // return res.json({"result":false,
  //                   "message":"Instructor not logged in"
  //                 });
  newClass.save(function(err,savedClass){
      if(err){
          console.log(err);
          return res.json({"result":false, "message":"Failed creating attendance sheet"});
      }
      return res.json({"result":true, "message":"Attendance Started!"});
  });
});


router.get('/end',function(req,res){
  mongoose.connection.close();
  return res.json({"message":"Attendance stopped!"});
});



module.exports = router;
