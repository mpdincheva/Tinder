
var configDB = require('./database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var users = db.get('users');

var ObjectId = require('mongodb').ObjectID;

var passwordHash = require('password-hash');


module.exports = (function () {

    function User(email, password, firstname, lastname) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;

        this.description;
        this.lat = "";
        this.lng = "";
        this.friends = [];
        this.socketId = "";
        this.chatRequests = [];
        this.sendedChatRequests = [];
    }

    function LocalUser(email, password, firstname, lastname) {
        this.provider = 'local';
        this.age;
        this.gender;
        this.profilePicture;
        User.call(this, email, password, firstname, lastname);
    }

    function ExternalUser(provider, email, password, firstname, lastname, profilePicture, gender, age) {
        this.provider = provider;
        this.profilePicture = profilePicture;
        this.gender = gender;
        this.age = age;
        User.call(this, email, password, firstname, lastname)
    }

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
        createLocalUser: function (email, password, firstname, lastname, cb) {
            var hashedPassword = passwordHash.generate(password);
            var createdUser = new LocalUser(email, hashedPassword, firstname, lastname)
            users.insert(createdUser, function (err, insertedUser) {
                if (cb) {
                    console.log("In database. Inserted user is: ");
                    console.log(insertedUser);
                    cb(null, insertedUser);
                }
            });
        },

        createExtenalUser: function (provider, email, password,
            firstname, lastname, profilePicture, gender, age, cb) {

            var hashedPassword = passwordHash.generate(password);

            var createdUser = new ExternalUser(provider, email, hashedPassword,
                firstname, lastname, profilePicture, gender, age)

            users.insert(createdUser, function (err, insertedUser) {
                if (cb) {
                    console.log("In database. Inserted user is: ");
                    console.log(insertedUser);
                    cb(null, insertedUser);
                }
            });
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
            console.log("user service found user by id");
            console.log(profileId);
            // console.log(ObjectId(profileId));
            users.find({ '_id': profileId })
                .then(function (data) {
                    console.log("FOUNDED USER IS--------------");
                    console.log(data);
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

        findUsersById: function (usersIds, cb) {
            // console.log("user service found user by id");
            // console.log(profileId);
            // console.log(ObjectId(profileId));
            users.find({ '_id': { $in: usersIds } })
                .then(function (data) {
                    // console.log(data);
                    if (data.length > 0) {
                        cb(null, data);
                    } else {
                        cb(null, false);
                    }
                })
                .catch(function (err) {
                    cb(err, false);
                })
        },

        getUsersSockets: function (fromUser, toUser, cb) {
            users.find({ _id: fromUser })
                .then(function (fromUser) {
                    users.find({ _id: toUser })
                        .then(function (toUser) {
                            console.log("From database. The users i found are:");
                            console.log(fromUser);
                            console.log(toUser);
                            cb(fromUser[0], toUser[0]);
                        })
                })
        },

        findAndUpdateSocketId: function (socketId) {
            users.findOneAndUpdate(
                { socketId: socketId },
                { $set: { socketId: "" } });
        },

        // For sending events on disconnected ->

        // findAndUpdateSocketId: function (socketId, cb) {
        //     console.log(socketId);
        //     users.find({ socketId: socketId })
        //         .then(function (user) {
        //             users.findOneAndUpdate(
        //                 { socketId: socketId },
        //                 { $set: { socketId: "" } });
        //             cb(user[0]);
        //         })
        // },

        findAndUpdateChatRequests: function (userId, requestFrom, cb) {
            users.findOneAndUpdate({ _id: userId },
                { $push: { chatRequests: requestFrom } }
            )
            console.log("In thwe database. User is updated");
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
                    $set: {
                        age: accountSettings.age,
                        gender: accountSettings.gender,
                        description: accountSettings.description,
                        interests: accountSettings.interests,
                        profilePicture: accountSettings.profilePicture
                    }
                });
        },



        updateUserFriends: function (userId, friendId) {
            console.log("From database when update user friends");
            console.log(userId + "--------" + friendId);
            users.findOneAndUpdate(
                { _id: userId },
                {
                    $push: { friends: friendId },
                    $pull: { chatRequests: friendId }
                });

            users.findOneAndUpdate(
                { _id: friendId },
                {
                    $push: { friends: userId },
                    $pull: { sendedChatRequests: userId }
                });
        },




        // Set chat requests to both of the users
        updateChatRequests: function (fromUserId, toUserId) {
            console.log("Will update user sended chat requests");
            users.findOneAndUpdate(
                { _id: fromUserId },
                { $push: { sendedChatRequests: toUserId } });

            users.findOneAndUpdate(
                { _id: toUserId },
                { $push: { chatRequests: fromUserId } });
        },




        addNewFriend: function (userId, friend) {
            users.findOneAndUpdate(
                { _id: userId },
                { $push: { friends: friend } })
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

        findUsers: function (lat, lng, radius, genderInput, ageInput, interest, cb) {
            var obj = {};
            if (typeof genderInput === "string") {
                obj.gender = genderInput;
            }

            users.find(obj)
                .then(function (data) {
                    var allUsers = [];
                    if (data.length > 0) {
                        for (var index = 0; index < data.length; index++) {
                            var returnUser = false;
                            if (interest !== "all") {
                                if (data[index]["interests"]) {
                                    for (var userInterest = 0; userInterest < data[index]["interests"].length; userInterest++) {
                                        if (data[index]["interests"][userInterest] == interest) {
                                            returnUser = true;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                returnUser = true;
                            }
                            if (returnUser && parseInt(data[index]["age"]) >= ageInput.minAge && parseInt(data[index]["age"]) <= ageInput.maxAge && distanceInKmBetweenTwoUsers(lat, lng, data[index].lat, data[index].lng) <= radius) {
                                allUsers.push(data[index]);
                            }
                        }
                        // console.log("Userite");
                        console.log(allUsers);
                        cb(null, allUsers);
                    }
                });
        },

        // getAllOnlineUsers: function (arrayWithIds, cb) {
        //     console.log("In get online users function..");
        //     users.find({ _id: { $in: arrayWithIds } })
        //         .then(function (data) {
        //             console.log("From the database.. all friends are:");
        //             // console.log(data);
        //             var onlineUsers = [];
        //             for (var index = 0; index < data.length; index++) {
        //                 // console.log("In the loop--->");
        //                 // console.log(data[index].socketId);
        //                 if (data[index].socketId) {
        //                     console.log(data[index]);
        //                     onlineUsers.push(data[index]);
        //                 }
        //             }
        //             console.log("Founded users from database are: ")
        //             console.log(onlineUsers);
        //             // console.log(onlineUsers);
        //             cb(null, onlineUsers);
        //         })
        //         .catch(function (err) {
        //             cb(err, false);
        //         })
        // },

    }
})();
