// var express = require('express');
// var router = express.Router();
// var passport = require('passport');
// require('../config/passport')(passport);

/* GET home page. */

// var configDB = require('../config/database');
// var mongodb = require('mongodb');
// var monk = require('monk');
// var db = monk(configDB.url);
// var users = db.get('users');

var multer = require("multer");
var upload = multer({dest: './uploads/'});

var user = require("../config/userService");

// var passwordHash = require('password-hash');
 

module.exports = function (app, passport) {
  
  app.post('/register', function (req, res, next) {
    user.checkIfUsernameExist('local', req.body.email, function(isAvalilableUsername) {
      if(isAvalilableUsername) {
        user.createUser('local', req.body.email, req.body.password, req.body.firstName, req.body.lastName);
        res.status(200).send();
      }
      else {
        res.status(404).send();
      }

    })
  })

  app.post('/login',
    passport.authenticate('local'),
    function (req, res, next) {
      // console.log(req.user);
      console.log("In /login route"),
      res.cookie('userid', req.user._id);
      res.json(req.user);
    }
  );

  // We send the client on facebook to authenticate ->
  app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' }),
   function() {
    console.log("Vikna me");
  });

  // Waiting for response from facebook->
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/index.html#/' }),
    function (req, res, next) {
      console.log("Poluchix usera.... toi izglejda ei taka:");
      res.cookie('userid', req.user._id);
      res.redirect('/index.html#/home');
    });


  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/index.html#/' }),
    function (req, res) {

      res.cookie('userid', req.user._id);
      res.redirect('/index.html#/home');
    });


  app.get('/logout', function (req, res) {
    req.logout();
    res.status(200).send();
    // res.redirect('/');
  });

  app.post('/upload', upload.any(), function (req, res, next) {
    console.log("upload");
    console.log(req.body, 'Body');
    console.log(req.files, 'files');
    res.end();
  });
}
// module.exports = router;
