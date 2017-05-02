var userService = require("../services/userService");
var interestsService = require("../services/interestsService");
var chatService = require("../services/chatService");
var eventsService = require("../services/eventsService");



module.exports = function (app, passport) {

	app.post('/register', function (req, res, next) {
		userService.checkIfUsernameExist('local', req.body.email, function (isAvalilableUsername) {
			if (isAvalilableUsername) {
				userService.createLocalUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, function (err, insertedUser) {
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

}