
var configDB = require('./database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var chat = db.get('chat');

var ObjectId = require('mongodb').ObjectID;


module.exports = (function () {

    function Message(fromUserId, toUserId, message, date) {
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.message = message;
        this.message = message;
        this.date = new Date();
    }

    return {
        insertMessage: function (fromUserId, toUserId, message) {
            chat.insert(new Message(fromUserId, toUserId, message));
        },
        
    //     findUserByName: function (provider, username, cb) {
    //         users.find({provider: provider, email: username}).then(function (data) {
    //             if (data.length > 0) {
    //                 cb(null, data[0]);
    //             } else {
    //                 cb(null, false);
    //             }
    //         })
    //         .catch(function(err) {
    //             cb(err, false);
    //         })
    //     },
    //     findUserById: function (profileId, cb) {
    //         console.log("user service found user by id");
    //         // console.log(profileId);
    //         console.log(ObjectId(profileId));
    //         users.find({'_id': profileId})
    //             .then(function (data) {
    //                 console.log(data);
    //                 if (data.length > 0) {
    //                     cb(null, data[0]);
    //                 } else {
    //                     cb(null, false);
    //                 }
    //             })
    //             .catch(function (err) {
    //                 cb(err, false);
    //             })
    //     },

    //     checkUserPassword: function (provider, username, password, cb) {
    //         users.find({provider: provider, 'email': username})
    //             .then(function (data) {
    //                 console.log(data);
    //                 if (data.length > 0) {
    //                     if(passwordHash.verify(password, data[0].password)) {
    //                     cb(null, data[0]);                            
    //                     }
    //                 } else {
    //                     cb(null, false);
    //                 }
    //             })
    //     },

    //     checkIfUsernameExist: function (provider, username, cb) {
    //         users.find({ 'provider': provider, 'email': username })
    //             .then(function (data) {
    //                 if (data.length > 0) {
    //                     cb(false);
    //                 } else {
    //                     cb(true);
    //                 }
    //             })
    //     },

    //     getUsersFriends: function(arrayWithIds, cb) {
    //         users.find({ _id : { $in : arrayWithIds } })
    //             .then(function(data) {
    //                 console.log("Founded users from database are: ")
    //                 console.log(data);
    //                 cb(null, data);
    //             })
    //             .catch(function(err) {
    //                 cb(err, false);
    //             })
    //     }
        
    }


})();

