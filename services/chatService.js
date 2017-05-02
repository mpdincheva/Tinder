
var configDB = require('../config/database.js');
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
        this.seen = false;
    }

    return {
        insertMessage: function (fromUserId, toUserId, message) {
            chat.insert(new Message(fromUserId, toUserId, message));
        },

        getMessages: function (fromUserId, toUserId, cb) {
            // chat.find({fromUserId: fromUserId, toUserId: toUserId}).sort({date: -1})
            chat.find({ $or: [{ fromUserId: fromUserId, toUserId: toUserId }, { fromUserId: toUserId, toUserId: fromUserId }] }, { 'sort': [['date', 'asc']] })
                // .sort({ date: 1 })
                .then(function (data) {
                    if (data) {
                        cb(null, data);
                    } else {
                        cb(null, false);
                    }
                })
                .catch(function (err) {
                    cb(err, false);
                })
        },

        setAllMessagesSeen: function (fromUserId, toUserId) {
            chat.find({ fromUserId: fromUserId, toUserId: toUserId })
                .then(function (data) {
                    if (data) {
                        for (var index = 0; index < data.length; index++) {
                            chat.update({ _id: data[index]._id }, { $set: { seen: true } });
                        }
                    }
                })

            // chat.updateMany({ $or: [{ fromUserId: fromUserId, toUserId: toUserId },
            //  { fromUserId: toUserId, toUserId: fromUserId }] }, {$set: {seen: true}} )
        },

        getAllUnseenMessages: function (fromUserid, cb) {
            chat.find({ toUser: fromUserid, seen: false })
                .then(function (messages) {
                    cb(messages);
                })
        }

    }


})();

