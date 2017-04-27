var chatService = require('./chatService');

var userService = require('./userService');
module.exports = function (app, passport) {

    var friends;
    
    app.io = require('socket.io')();


    app.io.on('connection', function (socket) {

        socket.on('updateSocket', function (data) {
            // data is the full current person object

            console.log("Made new socket id");

            console.log(data);
            userService.updateSocket(data.userId, socket.id);
            console.log("Sockets for current user: ");
            console.log(socket.id);
            console.log("Updated user id is: ");
            // console.log(data.user.socketId);

            // userService.getUsersFriends(data.user.friends, function(err, data) {
            //     if(data) {
            //         friends = data;
            //         console.log("Function for getting all friends result is: ");
            //         console.log(data);
            //     }
            // });
        })

        socket.on('new-msg', function (data) {
            console.log("Az sum survura i poluchavam suobshtenie.")
            // This is the final ------>
            console.log("Idva ot---"+ data.fromUser+"---Izprashtam go na: " + data.toUser + "----a suobshtenieto e: :--- " + data.msg);
            chatService.insertMessage(data.fromUser, data.toUser, data.msg);
            // socket.broadcast.to(users[data.toUser]).emit('new-msg', data.msg);
            // Sending message to the user and me
            app.io.to(socket.id).to(data.toUser).emit('new-msg', data.msg);
        });


        // userService -> Find all my friends which are online



        // console.log(socket.id);
        // userService.updateSocket()

        // var dbUsers = db.get("users");
        // Here socket provide uniqe socket id

        // socket.on('join', function (data) {

        //     for (var prop in users) {
        //         if (users[prop] == null) {
        //             users[prop] = socket.id;
        //         }
        //     }

        //     console.log("All users are: ");
        //     console.log(users);
        //     console.log("My id is: " + socket.id);

        //     // Add current user into users ANGLE_instanced_arrays. If exist it will update the socket id
        //     users[data.username] = socket.id;

        //     // console.log("All sockets are: ");
        //     // console.log(app.io.sockets.sockets);
        //     // Update user's socket id in database

        //     dbUsers.update({ username: data.username }, { $set: { socketid: socket.id } });
        //     // Create new room for this user
        //     // socket.join(data.username);

        //     // Get all users and refresh their chatlist -> 
        //     for (var user in users) {
        //         app.io.to(users[user]).emit('updateUsersList', users);
        //     }
        //     // console.log(socket.id)
        // })

        // socket.on('logout', function (data) {
        //     delete users[data.username];
        //     dbUsers.update({ username: data.username }, { $set: { socketid: null } });

        //     // Get all users and refresh their chatlist -> 
        //     for (var user in users) {
        //         app.io.to(user)
        //         app.io.to(users[user]).emit('updateUsersList', users);
        //     }
        // })

        // socket.on('disconnect', function () {
        //     console.log("disconted from server...")
        //     console.log(socket.id)
        //     for (var prop in users) {
        //         if (users[prop] === socket.id) {
        //             users[prop] == null;
        //         }
        //     }
        //     setTimeout(function () {
        //         // IF the user didnt come back, delete it from users array
        //     }, 1000);
        // });

        // socket.on('currentUser', function (data) {
        //   chatWith = data.chatWith;
        //   chatWithId = users[data.chatWith];
        //   // console.log(users);
        // })




    })
}