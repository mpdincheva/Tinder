var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require("multer");

// Including mongo database ->
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://vmmp:vmmp96@ds041432.mlab.com:41432/vmmp');

// Including Passport ->
var passport = require('passport');
var LocalStrategy = require('passport-local');
// var FacebookStrategy = require('passport-facebook');

var authStrategy = new LocalStrategy(function (username, password, done) {
  var users = db.get('users');
  passReqToCallback: true;
  users.find({ email: username })
    .then(function (data) {
      var user = data[0];
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      } else {
        return done(null, user);
      }
      console.log(data);
    })
    .catch(function (error) {
      return done(error, false);
    })
})

passport.use('local', authStrategy);

var index = require('./routes/index');
var users = require('./routes/users');
var accountSettings = require('./routes/accountSettings');
var upload = require("./routes/upload"); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest:'./uploads/'}).single('singleInputFileName'));

app.use(session({ secret: 'purple unicorn' }));
// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
// app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(bodyParser({uploadDir:'/path/to/temporary/directory/to/store/uploaded/files'}));


passport.serializeUser(function (user, done) {
  // What passport will save in the cookie ->
  if (user) {
    done(null, user._id);
  }
});

passport.deserializeUser(function (userId, done) {
  var users = db.get("db-users");
  users.find({ _id: userId })
    .then(function (data) {
      var user = data[0];
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      done(error, false);
    })
});


app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

// function requireLogin(req, res, next) {
//   return (req.user);
// }

// app.use('/login', login);
app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use('/upload', upload);
app.use('/', index);
app.use('/users', users);
app.use('/accountSettings', accountSettings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
