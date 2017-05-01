var configDB = require('../config/database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var events = db.get('events');

var ObjectId = require('mongodb').ObjectID;

module.exports = (function () {

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
        createEvent: function (lat, lng, name, date, description, createdby, cb) {
            events.insert({ name: name, lat: lat, lng: lng, date: new Date(date), description: description, createdby: createdby });
        },

        searchByRadius: function (lat, lng, radius, cb) {
            events.find({}).then(function (data) {
                var allEvents = [];
                var q = new Date();
                var m = q.getMonth();
                var d = q.getDate();
                var y = q.getFullYear();
                var dateNow = new Date(y, m, d);
                data.forEach(function (event) {
                    console.log(event.date);
                    var dateEvent = new Date(event.date);
                    console.log(distanceInKmBetweenTwoUsers(lat, lng, event.lat, event.lng) <= radius);
                    console.log(dateEvent > dateNow);
                    console.log(dateEvent);
                    console.log(dateNow);
                    if (distanceInKmBetweenTwoUsers(lat, lng, event.lat, event.lng) <= radius && dateEvent > dateNow) {
                        allEvents.push(event);
                    }
                });
                console.log(allEvents);
                cb(null, allEvents);
            });

        },

        addUserToEvent: function (userId, eventId, cb) {
            events.find({ _id: eventId }).then(function (data) {

                if (data[0]["going"]) {
                    data[0]["going"].push(userId);

                } else {
                    data[0]["going"] = [userId];
                }
                events.update({ _id: eventId }, { $set: { "going": data[0].going } })
                    .then(function () {
                        events.find({ _id: eventId })
                            .then(function (data) {
                                cb(null, data[0]);
                            });
                    });
            });

        },
        removeUserFromEvent: function (userId, eventId, cb) {
            events.find({ _id: eventId }).then(function (data) {
                if (data[0]["going"]) {
                    for (var index = 0; index < data[0]["going"].length; index++) {
                        if (data[0]["going"][index] == userId) {
                            data[0]["going"].splice(index, 1);
                            break;
                        }
                    }

                } else {
                    data[0]["going"] = [];
                }
                events.update({ _id: eventId }, { $set: { "going": data[0]["going"] } })
                    .then(function () {
                        events.find({ _id: eventId })
                            .then(function (data) {
                                cb(null, data[0]);
                            });
                    });
            });

        }
    }

})();
