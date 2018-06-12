var express = require('express');
var router = express.Router();
var Class = require('../lib/class');
var mongoose = require('mongoose');
var moment = require('moment');
var db_url = "mongodb://heroku_sp406f4tt:hackFresno2018@ds135252.mlab.com:35252/heroku_sp406f4t";
var geolib = require('geolib');
//start the db for attendance
router.post('/',function(req,res)
{
  //CONNECT TO DATABASE
  mongoose.connect(db_url);
  var db = mongoose.connection;
  db.once("open",function() {
  	console.log("DB connected!");
  });
  var cords = req.body.location.coordinates;
  var tempClass=new Class();
  var classDay = moment().month()+1 + '/' + moment().date() + '/' + moment().year();
  var classNumber = req.body.classNumber;
  if(!req.session.user)
  return res.json({"result":false,
                    "message":"User not logged in"
                  });
  Class.findOne({classNumber:classNumber,classDay:classDay},function(err,returnedClass){
    if(err){
      next(err);
    }else{
      if(geolib.getDistance(returnedClass['location'].coordinates,
      cords)<300){
          returnedClass.attendance.push({student_id: req.session.user['id_number']});
          res.json({"result":true,
                    "message":"Attendance Marked"});
      }
      else {
        res.json({"result":false,
                  "message":"Attendance is not marked"});
      }
    }
  })
});





module.exports = router;
