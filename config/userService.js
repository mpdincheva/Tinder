
var configDB = require('./database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var users = db.get('users');

var ObjectId = require('mongodb').ObjectID;

var passwordHash = require('password-hash');





module.exports = (function () {

    function User(provider, email, password, firstname, lastname) {
        this.provider = provider;
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;

        this.lat = "";
        this.lng = "";
        this.age;
        this.gender;
        this.description;
        this.profilePicture;
        this.friends = [];
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

    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function distanceInKmBetweenTwoUsers(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    return {
        createUser: function (provider, email, password, firstname, lastname) {
            var hashedPassword = passwordHash.generate(password);
            var createdUser = new User(provider, email, hashedPassword, firstname, lastname)
            users.insert(createdUser);
            return createdUser;
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
            users.find({ provider: provider, email: username }).then(function (data) {
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
        findUserById: function (profileId, cb) {
            // console.log("user service found user by id");
            // console.log(profileId);
            // console.log(ObjectId(profileId));
            users.find({ '_id': profileId })
                .then(function (data) {
                    // console.log(data);
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

        checkUserPassword: function (provider, username, password, cb) {
            users.find({ provider: provider, 'email': username })
                .then(function (data) {
                    // console.log(data);
                    if (data.length > 0) {
                        if (passwordHash.verify(password, data[0].password)) {
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
        },

        getUsersFriends: function (arrayWithIds, cb) {
            users.find({ _id: { $in: arrayWithIds } })
                .then(function (data) {
                    // console.log("Founded users from database are: ")
                    // console.log(data);
                    cb(null, data);
                })
                .catch(function (err) {
                    cb(err, false);
                })
        },

        // Must use findOneAndUpdate---->
        updateSocket: function (userId, socketId, cb) {
            users.findOneAndUpdate(
                { _id: userId },
                { $set: { socketId: socketId } })
        },

        updatePosition: function (userId, lat, lng, cb) {
            users.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        lat: lat,
                        lng: lng
                    }
                })
        },

        updateUserAccount: function (userId, accountSettings) {
            console.log(accountSettings);
            users.findOneAndUpdate(
                { _id: userId },
                {
                    $set: accountSettings
                })
        },

        findUsersByFullName: function (firstname, lastname, cb) {
            var lastName = new RegExp("^" + lastname);
            users.find({ firstname: firstname, lastname: lastName })
                .then(function (data) {
                    console.log(data);
                    cb(null, data);
                });
        },

        findUsersByFirstName: function (first, cb) {
            var firstName = new RegExp("^" + first);
            users.find({ firstname: firstName })
                .then(function (data) {
                    cb(null, data);
                });
        },

        findUsers: function (radius, gender, interest, cb) {
            users.find({ gender: gender })
                .then(function (data) {
                    console.log(data);
                    cb(null, data);
                });
        },
        
        getAllOnlineUsers: function (arrayWithIds, cb) {
            console.log("In get online users function..");
            users.find({ _id: { $in: arrayWithIds }  })
                .then(function (data) {
                    var onlineUsers = [];
                    for(var index = 0; index < data.length; index++) {
                        // console.log("In the loop--->");
                        // console.log(data[index].socketId);
                        if(data[index].socketId) {
                            console.log(data[index]);
                            onlineUsers.push(data[index]);
                        }
                    }
                    console.log("Founded users from database are: ")
                    // console.log(onlineUsers);
                    cb(null, onlineUsers);
                })
                .catch(function (err) {
                    cb(err, false);
                })
        },

    }
})();
