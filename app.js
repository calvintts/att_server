var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var classRouter = require('./routes/class');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var attendanceRouter = require('./routes/attendance');
var instructorRouter = require('./routes/instructor');
var mongoose = require('mongoose');

//CONNECT TO DATABASE
const db_url="mongodb://user_admin:admin123@ds117590.mlab.com:17590/attendance";
mongoose.connect(db_url);
var db = mongoose.connection;

setTimeout(function () {
	console.log(db.readyState);
}, 5000);
//check DB STATUS
// var db = mongoose.connection;
// db.once("open",function(err)
// {
//   if(err)
//   {console.log("shit");}
//   else {
//     console.log("connected");
//   }
// })
// .exec()
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.log("error connecting to db"+err));
// });

// {
//   if(err)
//   console.log("MongoDB not connected");
//   else {
//   console.log("MongoDB connected");
//   }
// };



var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/class',classRouter);
app.use('/attendance',attendanceRouter);
app.use('/instructor',instructorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
