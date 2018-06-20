var express = require('express');
var router = express.Router();
var Class = require('../models/class');
var mongoose = require('mongoose');
var moment = require('moment');
var geolib = require('geolib');
router.post('/',function(req,res)
{
  var cords = req.body.location.coordinates;
  var tempClass=new Class();
  var classDay = moment().month()+1 + '/' + moment().date() + '/' + moment().year();
  var classNumber = req.body.classNumber;
  // return res.json({"result":false,
  //                   "message":"User not logged in"
  //                 });
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
