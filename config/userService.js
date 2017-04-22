
var configDB = require('./database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var users = db.get('users');
// In passport strategies for creating users ->
// createUser('facebook', username, password, ....)

// Module design pattern
module.exports = (function () {


    // var User = (function () {


    function User(email, password, firstname, lastname, age) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
    }

    function LocalUser(email, password, firstname, lastname, age) {
        User.call(this, email, password, firstname, lastname, age);
    }

    function FacebookUser(facebookId, email, password, firstname, lastname, age) {
        this.facebookId = facebookId;
        User.call(this, email, password, firstname, lastname, age);
    }

    function GoogleUser(googleId, email, password, firstname, lastname, age) {
        this.googleId = googleId;
        User.call(this, email, password, firstname, lastname, age);
    }

    // factory methodx
    return {
            createLocalUser : function(){
                users.insert(new LocalUser(email, password, firstname, lastname, age));
            },
            createFacebookUser : function(){
                console.log('I will create facebook user');
                users.insert(new FacebookUser(facebookId, email, password, firstname, lastname, age));
            },
            createGoogleUser : function(){
                users.insert(new GoogleUser(googleId, email, password, firstname, lastname, age));
            },
            findUserByName: function(username) {
                users.find({email: username}).then(function(data) {
                    if(data.length > 0) {
                        return data[0];
                    } else {
                        return false;
                    }
                })
            },
            checkUserPassword: function(username, password) {
                console.log("In user service");
                console.log(username + "---" + password);

                // users.find({email: username, password: '123'}).then(function(data) {
                //     console.log(data);
                // });
                console.log(typeof(String(password)));
                users.find({'email': username, 'password': String(password)})
                    .then(function(data) {
                        console.log('UserService - namerix ei toq user')
                        console.log(data);
                        console.log(data.length);                        
                    if(data.length > 0) {
                        return data[0];
                    } else {
                        return false;
                    }
                })
            }
        //  createUser : function (registerFrom,  email, password, firstname, lastname, age) {
        //     if (registerFrom === 'local') {
        //         users.insert(new LocalUser(email, password, firstname, lastname, age));
        //     }
        //     if (registerFrom === 'facebook') {
        //         console.log('Az sum konstruktora e shte syzdam user');
        //         users.insert(new FacebookUser(facebookid, email, password, firstname, lastname, age));
        //     }
        //     if (registerFrom === 'google') {
        //         users.insert(new GoogleUser(email, password, firstname, lastname, age));
        //     }
        // },

        // findUser : function(username, password) {
        //     console.log("Searching users..");
        //     users.find({email: username, password: password})
        //         .then(function(data) {
        //             if(data.length > 0) {
        //                 var user = data[0];
        //                 return user;
        //             } else {
        //                 return false;
        //             }
        //         })
        //         .catch(function(err) {
        //             return err;
        //         })
        // }
    }
    // })




})();





// passport.js



// User.createUser('facebook', username, password, age ....);

// var currentUser = new User(...);
// currentUser
// Vuv RegisterUser.js -->

// require mongodb
// {

// }
