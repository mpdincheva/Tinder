
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var configDB = require('./database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);

var user = require('./userService');
// User.createUser("facebook", 12, 32, 5, 2, 5,3);
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        // What passport will save in the cookie ->
        if (user) {
            done(null, user._id);
        }
    });




    // used to deserialize the user
    passport.deserializeUser(function (userId, done) {
        var users = db.get("users");
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




    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local', new LocalStrategy(function (username, password, done) {
      // console.log("In local strategy");
      //   var currentUser = user.checkUserPassword(username, password)
      //   console.log("Az sum ot pasporta.. potrebitelq koito stiga do men e:")
      //   console.log(currentUser);
      //   if(currentUser) {
      //     return done(null, currentUser);
      //   } else {
      //     return done(null, false);
      //   }
        var users = db.get('users');
        // console.log(users);
        passReqToCallback: true;
        // console.log(User);
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
    }))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use('facebook', new FacebookStrategy({
  clientID: '1672842996345585',
  clientSecret: 'c5652cbfd993d12475820314153e7e24',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',

  // Set what fields will expect from facebook
  "profileFields": ["id", "birthday", "email", "first_name", "gender", "last_name", "photos"]
},
  function (accessToken, refreshToken, profile, done) {
    // Find or create user in the database ->
    var users = db.get('users');

    users.find({ 'facebook-id': profile.id }, function (err, data) {
      // data returns array with objects
      var user = data[0];
      // Returns error with the database
      if (err) {
        console.log("Error");
        return done(err, false);
      }
      // Returns founded user
      if (user) {
        console.log("User found");
        return done(null, user);
      } else {
        console.log("Register facebook user");
        users.insert({
          'facebook-id': profile.id,
          'facebook-token': accessToken,
          'facebook-name': profile.displayName,
          'facebook-email': profile.emails[0].value,
          'facebook-pictures': profile.photos,
        })
        return done(null, user);
      }
    })
  }))



// =========================================================================
// GOOGLE ================================================================
// =========================================================================


passport.use('google', new GoogleStrategy({
  clientID: '974128199188-9csvji2p5goecra3jjf1a97532lrbvkf.apps.googleusercontent.com',
  clientSecret: '43av-A8qr2_k6dJURxWaeXWn',
  callbackURL: "http://localhost:3000/auth/google/callback",

  // Set what fields will expect from facebook
  "profileFields": ["id", "birthday", "email", "first_name", "gender", "last_name", "photos"]
},
  function (accessToken, refreshToken, profile, done) {
    // Find or create user in the database ->
    var users = db.get('users');
    
    console.log("Google ni vrushta potrebitelq ei taka: ");
    console.log(profile);

    users.find({ 'google-id': profile.id }, function (err, data) {
      // data returns array with objects
      var user = data[0];
      // Returns error with the database
      if (err) {
        console.log("Error");
        return done(err, false);
      }
      // Returns founded user
      if (user) {
        console.log("User found");
        return done(null, user);
      } else {
        console.log("Register google user");
        users.insert({
          'google-id': profile.id,
          'google-token': accessToken,
          'google-name': profile.displayName,
          'google-email': profile.emails[0].value,
          'google-pictures': profile.photos,
        })
        return done(null, user);
      }
    })
  }))


};