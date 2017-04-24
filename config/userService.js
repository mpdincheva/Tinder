
var configDB = require('./database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var users = db.get('users');



var passwordHash = require('password-hash');


module.exports = (function () {

    function User(provider, email, password, firstname, lastname) {
        this.provider = provider;
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    // function LocalUser(email, password, firstname, lastname) {
    //     User.call(this, email, password, firstname, lastname);
    // }

    // function FacebookUser(facebookId, email, password, firstname, lastname) {
    //     // this._id = facebookId;
    //     User.call(this, email, password, firstname, lastname);
    // }

    // function GoogleUser(googleId, email, password, firstname, lastname) {
    //     this.googleId = googleId;
    //     User.call(this, email, password, firstname, lastname);
    // }

    return {
        createUser: function (provider, email, password, firstname, lastname) {
            var hashedPassword = passwordHash.generate(password);
            users.insert(new User(provider, email, hashedPassword, firstname, lastname));
        },
        // createLocalUser : function(email, password, firstname, lastname){
        //     users.insert(new LocalUser(email, password, firstname, lastname));
        // },
        // createFacebookUser : function(facebookId, email, password, firstname, lastname){
        //     console.log('I will create facebook user');
        //     console.log(facebookId);
        //     console.log(email);
        //     console.log(password);
        //     console.log(firstname);
        //     console.log(lastname);
        //     users.insert(new FacebookUser(facebookId, email, password, firstname, lastname))
        // },
        // createGoogleUser : function(){
        //     users.insert(new GoogleUser(googleId, email, password, firstname, lastname));
        // },
        findUserByName: function (provider, username, cb) {
            users.find({provider: provider, email: username}).then(function (data) {
                if (data.length > 0) {
                    cb(null, data[0]);
                } else {
                    cb(null, false);
                }
            })
            .catch(function(err) {
                cb(err, false);
            })
        },
        findUserById: function (profileId, cb) {
            console.log("user service found user by id");
            // console.log(profileId);
            console.log(ObjectId(profileId));
            users.find('_id', profileId)
                .then(function (data) {
                    console.log(data);
                    if (data.length > 0) {
                        cb(null, data[0]);
                    } else {
                        cb(null, false);
                    }
                })
                .catch(function (err) {
                    cb(err, false);
                })
        },

        checkUserPassword: function (username, password, cb) {
            console.log("In user service");
            console.log(username + "---" + password);

            // users.find({email: username, password: '123'}).then(function(data) {
            //     console.log(data);
            // });
        //   var hashedPassword = passwordHash.generate(password);
        //     console.log(typeof (String(password)));
        //     console.log(hashedPassword);
            
            users.find({ 'email': username})
                .then(function (data) {
                    if (data.length > 0) {
                        if(passwordHash.verify(password, data[0].password)) {
                        cb(null, data[0]);                            
                        }
                    } else {
                        cb(null, false);
                    }
                })
        },

        checkIfUsernameExist: function (provider, username, cb) {
            users.find({ 'provider': provider, 'email': username })
                .then(function (data) {
                    if (data.length > 0) {
                        cb(false);
                    } else {
                        cb(true);
                    }
                })
        }
        
    }


})();

