// var express = require('express');
// var router = express.Router();
// var passport = require('passport');
// require('../config/passport')(passport);

/* GET home page. */

var configDB = require('../config/database');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var users = db.get('users');
var multer = require("multer");
var fs = require("fs");

module.exports = function (app, passport) {

	app.post('/register', function (req, res, next) {
		console.log("Made register post request");
		users.find({ email: req.body.email }).then(function (data) {
			console.log(data);
			if (data.length > 0) {
				res.status(404).send();
			} else {
				users.insert({
					'firstname': req.body.firstName,
					'lastname': req.body.lastName,
					'email': req.body.email,
					'password': req.body.password,
				}).then(function () {
					var user = users.findOne({ email: req.body.email });
					res.cookie('userid', user._id);
					res.json(user);
				});
				// console.log(req.body);
				// res.status(200).send();
			}
		});

	});

	app.post('/login',
		passport.authenticate('local'),
		function (req, res, next) {
			// console.log(req.user);
			console.log("In /login route"),
				res.cookie('userid', req.user._id);
			res.json(req.user);
		}
	);

	// app.post('/login', function(req, res, next) {
	//   passport.authenticate('local', function(err,user) {
	//           if(!user) res.send('Sorry, you\'re not logged in correctly.');
	//           if(user) res.json(req.user);
	//   });
	// })

	// We send the client on facebook to authenticate ->
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	// Waiting for response from facebook->
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', { failureRedirect: '/login' }),
		function (req, res, next) {
			console.log("Poluchix usera.... toi izglejda ei taka:");
			res.json(req.user);
		});

	app.get('/auth/google',
		passport.authenticate('google', { scope: ['profile', 'email'] }));

	app.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/login' }),
		function (req, res) {
			console.log("Az sum google i poluchix usera.. toi izglejda ei taka:");
			res.json(req.user);
		});


	app.get('/logout', function (req, res) {
		res.clearCookie("userid");
		req.logout();
		res.redirect('/');
	});

	var upload = multer({ dest: "public/assets/images/profilePhotos" });

	app.post('/save', upload.any(), function (req, res, next) {
		var obj = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			age: req.body.age,
			gender: req.body.gender
		}
		if (req.files.length > 0) {
			obj["profilePicture"] = req.files[0].path;
		} else {
			obj["profilePicture"] = "public/assets/images/profilePhotos/default.svg";
		}
		console.log(obj);
		res.json({ "success": "Uploaded.", "status": 200 });
	});

}
// module.exports = router;
