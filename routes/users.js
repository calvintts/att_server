var express = require('express');
var router = express.Router();
var User = require('../lib/User');
var md5= require('md5');
var mongoose = require('mongoose');
var ExpressBrute = require ('express-brute');
var db_url="mongodb://heroku_sp406f4tt:hackFresno2018@ds135252.mlab.com:35252/heroku_sp406f4t";
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store,{
	freeRetries: 2,
	minWait: 1000 * 60, //1 minute
	maxWait: 10*60*1000, //10 minutes
	failCallback: ExpressBrute.FailTooManyRequests
});


//CONNECT TO DATABASE
mongoose.connect(db_url);
var db = mongoose.connection;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//POST REQUEST FOR SAVING USER TO DB
router.post('/register',function(req,res)
{
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

    var newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.id_number = id_number;

    User.findOne({email:email},function(err,user){
        if(err) {
            console.log(err);
            res.json(err);
        } else {
            if(user==null) {
                newUser.save(function(err,savedUser){
                    if(err){
                        console.log(err);
                        return res.json({"result":false, "message":"Failed creating an account"});
                    }
                    return res.json({"result":true, "message":"Account Registered!"});
                });
            }else{
                console.log(user);
                res.json({"result":false, "message":"Email already exists"});
            }
        }
    });
});

//POST REQUEST FOR FINDING USER
router.post('/login',bruteforce.prevent,function(req,res,next)
{
	mongoose.connect(db_url);
  var db = mongoose.connection;
  db.once("open",function() {
  	console.log("DB connected!");
  });
  if(!req.body.email) return res.json({"result":false, "message":"Email required"});
  if(!req.body.password) return res.json({"result":false, "message":"Password required"});
  var email = req.body.email;
  var password = md5(req.body.password);

  User.findOne({email: email, password: password},function(err,user){
    if(err) {
        next(err);
      //return res.json({"result":false, "message":"Login Failed"});
    } else {
        //if user exists
        console.log(user);
        if(user) {
						req.session.user = user;
            return res.json({
                "result": true,
                "message": "Login success",
                "data": {
                    "firstname": user['firstname'],
                    "lastname": user['lastname'],
                    "id_number": user['id_number']
                }
          });
        }
        // if user doesn't exist
        res.json({
            "result": false,
            "message": "Login Failed"
        });
    }
  })
});

router.get('/menu',function(req,res){
	if(!req.session.user){
		return res.json({
			"result": false,
			"message": "User not logged in"
		});}
		else{
		return res.json({
			"result":true,
			"message": "Session Created",
			"data": {
					"firstname": req.session.user['firstname'],
					"lastname": req.session.user['lastname'],
					"id_number": req.session.user['id_number']
			}
		});
	}
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
