var express = require('express');
var router = express.Router();
var md5= require('md5');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('hello calvin');
});



module.exports = router;
