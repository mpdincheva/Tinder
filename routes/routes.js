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

var userService = require("../config/userService");
var interestsService = require("../config/interestsService");
var chatService = require("../config/chatService");


// var passwordHash = require('password-hash');

module.exports = function (app, passport) {

  app.post('/register', function (req, res, next) {
    console.log("You made post request to register page");
    userService.checkIfUsernameExist('local', req.body.email, function (isAvalilableUsername) {
      console.log(isAvalilableUsername);
      if (isAvalilableUsername) {
        userService.createLocalUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, function (err, insertedUser) {
          console.log("From server: Inserted user is:")
          console.log(insertedUser);
          res.cookie("userid", insertedUser._id);
          res.json(insertedUser);
        });
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
        console.log(req.user._id)
      res.cookie('userid', req.user._id);
      res.json(req.user);
    }
  );

  // We send the client on facebook to authenticate ->
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' }));

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
      console.log("Google passport");
      res.cookie('userid', req.user._id);
      res.redirect('/index.html#/home');
    });


  app.get('/logout', function (req, res) {
    req.session.destroy();
    // req.logout();
    res.status(200).send();
    // res.redirect('/');
  });

  var upload = multer({ dest: "public/assets/images/profilePhotos" });

  app.post('/updateAccountInfo', upload.any(), function (req, res, next) {
    var obj = {
      age: req.body.age,
      gender: req.body.gender,
      description: req.body.description
    }
    if (req.files.length > 0) {
      obj["profilePicture"] = req.files[0].path;
    } else {
      obj["profilePicture"] = "assets/images/profilePhotos/default.svg";
    }
    console.log(obj);
    userService.updateUserAccount(req.cookies.userid, obj);

    userService.findUserById(req.cookies.userid, function (err, user) {
      if (user) {
        res.json(user);
      }
    })

    // res.status(200).send();
  });

  app.get('/getFriends', function (req, res) {
    userService.findUserById(req.cookies.userid, function (err, user) {
      if (user) {
        userService.getUsersFriends(user.friends, function (err, friends) {
          res.json(friends);
        })
      }
    })
  })

  app.get('/updateSocket', function (req, res) {
    console.log(req.cookies.userid);
    res.json('');
  })

  app.get('/getAllInfoForMe', function (req, res) {
    console.log("In get all info for me in Server");
    console.log(req.cookies.userid);
    userService.findUserById(req.cookies.userid, function (err, user) {
      if (user) {
        // console.log("Sending user to the client:");
        // console.log(user);
        res.json(user);
      } else {
        res.status(404).send();
      }
    })
  })

  app.post("/updatePosition", function (req, res, next) {
    // console.log(req.body.lat);
    // console.log(req.body.lng);
    // console.log("Eto ti go user-a");
    // console.log(req.cookies.userid);
    var user_id = (req.body.id) ? req.body.id : req.cookies.userid;
    userService.updatePosition(user_id, req.body.lat, req.body.lng);
    res.status(200).send();
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

  app.get("/users:name", function (req, res, next) {
    var decodedName = decodeURIComponent(req.params.name);
    var firstNameIndex = decodedName.indexOf(" ");
    console.log(firstNameIndex);
    if (firstNameIndex != -1) {
      var firstName = decodedName.slice(0, firstNameIndex);
      var lastName = decodedName.slice(firstNameIndex + 1, decodedName.length);
      userService.findUsersByFullName(firstName, lastName, function (err, data) {
        console.log(data);
      });
    } else {
      var firstName = decodedName;
      userService.findUsersByFirstName(firstName, function (err, data) {
        res.json(data);
      });
    }
    // res.json(decodedName);
  });

  app.get('/allMessagesBetween:friendId', function (req, res, next) {
    var friendId = req.params.friendId;
    console.log("In the server. My friends id is: ");
    console.log(friendId);
    chatService.getMessages(req.cookies.userid, friendId, function (err, messages) {
      if (messages) {
        res.json(messages);
      } else {
        res.status(200).send();
      }
      if (err) {
        res.status(500).send();
      }
    })
  });

  app.get("/getInterests", function (req, res, next) {
    interestsService.getAll(function (err, data) {
      res.json(data);
    })
  });

  app.post("/allUsers", function (req, res, next) {
    userService.findUsers(req.body.lat, req.body.lng, req.body.radius, req.body.gender, req.body.age, req.body.interest, function (err, data) {
      res.json(data);
    });
  });

  
  app.get("/getUserInfo:userId", function(req, res, next) {
    userService.findUserById(req.params.userId, function(err, user) {
      if(user) {
        res.json(user);
      }
    })
  })

  app.post('/receiveChatRequest', function(req, res, next) {
    // userService
    console.log("Receiving chat request from server");
    console.log(req.body.user);
    userService.findAndUpdateChatRequests(req.cookies.userid, req.body.user);
  })

  app.post('/updateUserFriends', function(req, res, next) {
    console.log("I will update users friends")
    console.log(req.body.currentUserId);
    console.log(req.body.friendId);
    userService.updateUserFriends(req.body.currentUserId, req.body.friendId);
    res.status(200).send();
  })

  // app.post('/sendedChatRequests', function(req, res, next) {
  //     userService.updateChatRequests(req.cookies.userid, req.body);
  //     res.status(200).send();
  // })
  

}

