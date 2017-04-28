var configDB = require('./database.js');
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk(configDB.url);
var interests = db.get('interests');

var ObjectId = require('mongodb').ObjectID;


module.exports = (function () {

    function Interest(name) {
        this.name = name;
    }

    return {
        getAll: function(cb){
            interests.find({})
            .then(function(data){
                cb(null, data);
            })
            .catch(function(){
                cb(err, []);
            });
        }        
    }

})();

