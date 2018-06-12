var express = require('express');
var router = express.Router();
var Instructor = require('../lib/Instructor');
var md5= require('md5');
var mongoose = require('mongoose');
var ExpressBrute = require ('express-brute');

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store,{
	freeRetries: 2,
	minWait: 1000 * 60, //1 minute
	maxWait: 10*60*1000, //10 minutes
	failCallback: ExpressBrute.FailTooManyRequests
});

var db_url = "mongodb://heroku_sp406f4tt:hackFresno2018@ds135252.mlab.com:35252/heroku_sp406f4t";




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//POST REQUEST FOR SAVING USER TO DB
router.post('/register',function(req,res)
{
  //CONNECT TO DATABASE
  mongoose.connect(db_url);
  var db = mongoose.connection;
  db.once("open",function() {
  	console.log("DB connected!");
  });

    if(!req.body.email) return res.json({"result":false, "message":"Email required"});
    if(!req.body.password) return res.json({"result":false, "message":"Password required"});
    if(!req.body.firstname) return res.json({"result":false, "message":"Firstname required"});
    if(!req.body.lastname) return res.json({"result":false, "message":"Lastname required"});
    if(!req.body.id_number) return res.json({"result":false, "message":"ID required"});

    var email = req.body.email;
    var password = md5(req.body.password);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var id_number = req.body.id_number;

    var newInstructor = new Instructor();
    newInstructor.email = email;
    newInstructor.password = password;
    newInstructor.firstname = firstname;
    newInstructor.lastname = lastname;
    newInstructor.id_number = id_number;

    Instructor.findOne({email:email},function(err,instructor){
        if(err) {
            console.log(err);
            res.json(err);
        } else {
            if(instructor==null) {
                newInstructor.save(function(err,savedInstructor){
                    if(err){
                        console.log(err);
                        return res.json({"result":false, "message":"Failed creating an account"});
                    }
                    return res.json({"result":true, "message":"Account Registered!"});
                });
            }else{
                console.log(instructor);
                res.json({"result":false, "message":"Email already exists"});
            }
        }
    });
});

//POST REQUEST FOR FINDING USER
router.post('/login',bruteforce.prevent,function(req,res,next)
{
  //CONNECT TO DATABASE
  mongoose.connect(db_url);
  var db = mongoose.connection;
  db.once("open",function() {
  	console.log("DB connected!");
  });
  if(!req.body.email) return res.json({"result":false, "message":"Email required"});
  if(!req.body.password) return res.json({"result":false, "message":"Password required"});
  var email = req.body.email;
  var password = md5(req.body.password);

  Instructor.findOne({email: email, password: password},function(err,instructor){
    if(err) {
        next(err);
      //return res.json({"result":false, "message":"Login Failed"});
    } else {
        //if instructor exists
        console.log(instructor);
        if(instructor) {
						req.session.instructor = instructor;
            return res.json({
                "result": true,
                "message": "Login success",
                "data": {
                    "firstname": instructor['firstname'],
                    "lastname": instructor['lastname'],
                    "id_number": instructor['id_number']
                }
          });
        }
        // if instructor doesn't exist
        res.json({
            "result": false,
            "message": "Login Failed"
        });
    }
  })
});

router.get('/logout',function(req,res)
{
	req.session.destroy();
	return res.json({
		"result":true,
		"message":"User logged out"
	});
})

module.exports = router;
