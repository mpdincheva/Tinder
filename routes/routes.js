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

var userService = require("../services/userService");
var interestsService = require("../services/interestsService");
var chatService = require("../services/chatService");
var eventsService = require("../services/eventsService");


// var passwordHash = require('password-hash');

module.exports = function (app, passport) {

	var upload = multer({ dest: "public/assets/images/profilePhotos" });

	app.post('/updateAccountInfo', upload.any(), function (req, res, next) {
		var obj = {
			age: req.body.age,
			gender: req.body.gender,
			description: req.body.description
		}
		if (req.files.length > 0) {
			obj["profilePicture"] = req.files[0].path.substr(7);
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
		var user_id = (req.body.id) ? req.body.id : req.cookies.userid;
		userService.updatePosition(user_id, req.body.lat, req.body.lng);
		res.status(200).send();
	})




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

	app.post("/saveEvent", function (req, res, next) {
		eventsService.createEvent(req.body.lat, req.body.lng, req.body.name, req.body.date, req.body.description, req.body.createdby, function (err, data) {
			res.json(data);
		});
	});

	app.post("/findEvents", function (req, res, next) {
		eventsService.searchByRadius(req.body.lat, req.body.lng, req.body.radius, function (err, data) {
			res.json(data);
		});
	});


	app.post("/getUsersById", function(req, res, next){
		userService.findUsersById(req.body.users, function (err, data) {
			res.json(data);
		});
	});

	app.post("/addUserToEvent", function (req, res, next) {
		eventsService.addUserToEvent(req.body.user, req.body.event, function (err, data) {
			res.json(data);
		});
	});

	app.post("/removeUserFromEvent", function (req, res, next) {
		eventsService.removeUserFromEvent(req.body.user, req.body.event, function (err, data) {
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

