var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var classRouter = require('./routes/class');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var attendanceRouter = require('./routes/attendance');
var instructorRouter = require('./routes/instructor');
var mongoose = require('mongoose');
const db_url="mongodb://heroku_sp406f4tt:hackFresno2018@ds135252.mlab.com:35252/heroku_sp406f4t";
mongoose.connect(db_url).exec().then(()=>
{
  console.log("MongoDB connected")
})
.catch(err=>
{
  console.log('error connected to MongoDB');
});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(session({secret:"hackathonapp",resave:false,saveUninitialized:true}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
