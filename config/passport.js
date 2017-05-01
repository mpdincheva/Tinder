var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;



var userService = require('../services/userService');

// expose this function to our app using module.exports
module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    // What passport will save in the cookie ->
    if (user) {
      done(null, user._id);
    }
  });


  // used to deserialize the user
  passport.deserializeUser(function (userId, done) {
    userService.findUserById(userId, function (err, user) {
      if (err) {
        done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
  });


  // LOCAL LOGIN STRATEGY -------------->


  passport.use('local', new LocalStrategy(function (username, password, done) {
    console.log("In local strategy");

    // Check username and password in userService
    userService.checkUserPassword('local', username, password, handleUser);

    function handleUser(error, user) {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  }))



  // FACEBOOK STRATEGY ------------------------->

  passport.use('facebook', new FacebookStrategy({
    clientID: '1672842996345585',
    clientSecret: 'c5652cbfd993d12475820314153e7e24',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',

    // Set what fields will expect from facebook
    "profileFields": ["id", "birthday", "email", "first_name", "gender", "last_name", 'picture.type(large)']
  },
    function (accessToken, refreshToken, profile, done) {
      console.log("Profile from facebook is: ");
      console.log(profile);

      userService.findUserByName('facebook', profile.emails[0].value, function (err, user) {
        if (err) {
          return done(err, null);
        }
        if (user) {
          return done(null, user);
        } else {
          console.log("Creating facebook user");
          userService.createExtenalUser('facebook', profile.emails[0].value,
            accessToken, profile.name.givenName, profile.name.familyName,
            profile.photos[0].value, profile.gender, '', function (err, createdUser) {
              return done(null, createdUser);
            });

        }
      })
    }))



  // GOOGLE STRATEGY--------------------------->

  passport.use('google', new GoogleStrategy({
    clientID: '974128199188-9csvji2p5goecra3jjf1a97532lrbvkf.apps.googleusercontent.com',
    clientSecret: '43av-A8qr2_k6dJURxWaeXWn',
    callbackURL: "http://localhost:3000/auth/google/callback",

    // Set what fields will expect from facebook
    "profileFields": ["id", "birthday", "email", "first_name", "gender", "info", "age", "photos"]
  },
    function (accessToken, refreshToken, profile, done) {
      console.log("From passport authenticate");
      console.log(profile);

      userService.findUserByName('google', profile.emails[0].value, function (err, user) {
        if (err) {
          return done(err, null);
        }
        if (user) {
          return done(null, user);
        } else {
          userService.createExtenalUser('google', profile.emails[0].value,
            accessToken, profile.name.givenName, profile.name.familyName,
            profile.photos[0].value, profile.gender, '', function (err, createdUser) {
              return done(null, createdUser);
            });

        }
      })
    }))

}