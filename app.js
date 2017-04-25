var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require("multer");
var upload = multer({dest:'./uploads/'}).single('singleInputFileName');
var passwordHash = require('password-hash');



// Including mongo database if we need it->
// var mongodb = require('mongodb');
// var monk = require('monk');
// var configDB = require('./config/database.js');
// var db = monk(configDB.url);

// Including Passport ->
var passport = require('passport');

require('./config/passport')(passport);

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload);

app.use(session({ secret: 'purple unicorn' }));
// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
// app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(bodyParser({uploadDir:'/path/to/temporary/directory/to/store/uploaded/files'}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes.js')(app, passport);
require('./config/socketIO')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
