var express = require('express');
var router = express.Router();
var User = require('../lib/User');
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hey Calvin Your API is working' });
});



module.exports = router;
