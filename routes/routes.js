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

var userService = require("../config/userService");

// var passwordHash = require('password-hash');
 

module.exports = function (app, passport) {
  
  app.post('/register', function (req, res, next) {
    userService.checkIfUsernameExist('local', req.body.email, function(isAvalilableUsername) {
      if(isAvalilableUsername) {
        userService.createUser('local', req.body.email, req.body.password, req.body.firstName, req.body.lastName);
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
    req.session.destroy();
    // req.logout();
    res.status(200).send();
    // res.redirect('/');
  });

  app.post('/upload', upload.any(), function (req, res, next) {
    console.log("upload");
    console.log(req.body, 'Body');
    console.log(req.files, 'files');
    res.end();
  });

  // app.get('/myUser:userId', function(req, res) {
  //   console.log('In my User get request');
  //   console.log(req.params);
  //   console.log(req.params.userId);
  //   var userid = req.params.userId.substring(10, req.params.userId.length - 1);
  //   console.log(userid);
  //   user.findUserById(userid, function(err, user) {
  //     console.log(err);
  //     console.log(user);
  //     if(user) {
  //       res.json(user);
  //     }
  //   })
  // })

  app.get('/getFriends:userId', function(req, res) {
    // console.log("In the server...");
    // console.log(req.params.userId);
    userService.findUserById(req.params.userId, function(err, user) {
      if(user) {
        // console.log(user);
        userService.getUsersFriends(user.friends, function(err, friends) {
          // console.log("Get all friends in one array: ");
          // console.log(friends);
          res.json(friends);
        })
      }
    })
  })

  app.get('/updateSocket', function(req, res) {
    console.log(req.cookies.userid);
    res.json('');
  })



//   router.post('/', function (req, res, next) {
//     var userid = req.session.userId;
//     console.log(req.session.userId);
//     var db = req.db;
//     var users = db.get('users');
//     users.find({_id: userid})
//         .then(function (data) {
//             if (data.length > 0) {
//                 var user = data[0];
//                 console.log(user);
//                 res.json(user);
//             } else {
//                 res.json('');
//             }
//         }).catch(function (err) {
//         res.json(500, err);
//     });
// });
}
// module.exports = router;












