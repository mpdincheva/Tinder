var chatService = require('./chatService');

var userService = require('./userService');
module.exports = function (app, passport) {

    var onlineUsers = [];

    app.io = require('socket.io')();


    app.io.on('connection', function (socket) {
        console.log("Made new connection");


        socket.on('updateSocket', function (data) {
            // data is the full current person object

            console.log("Made new socket id");

            // console.log(data.user);
            console.log(data.user._id);
            // console.log(typeof data.user)

            userService.updateSocket(data.user._id, socket.id);
            // console.log("Sockets for current user: ");
            // console.log(socket.id);
            // console.log("Updated user socket id is: ");
            // console.log(data.user.socketId);

            // Get all online friends
            userService.getAllOnlineUsers(data.user.friends, function (err, myFriends) {

                myFriends.forEach(function (friend) {
                    console.log("My online friends are:  ");
                    console.log(friend);
                    app.io.to(friend.socketId).emit('onlineFriend', data.user);
                    // socket.emit('updateChatList', user);
                })

            })
        })



        socket.on('new-msg', function (data) {
            // This is the final ------>
            chatService.insertMessage(data.fromUser, data.toUser, data.msg);

            userService.findUserById(data.toUser, function (err, user) {
                // console.log("Founded user is: ");
                // console.log(user);
                // console.log(user.socketId);
                app.io.to(socket.id).to(user.socketId).emit('new-msg', { 'fromUserId': data.fromUser, 'message': data.msg });
            })

        });


        // socket.on('disconnect', function () {
        //     console.log(socket.id);
        //     userService.getAllOnlineUsers(data.user.friends, function (err, myFriends) {

        //         myFriends.forEach(function (friend) {
        //             console.log("My online friends are:  ");
        //             console.log(friend);
        //             app.io.to(friend.socketId).emit('offlineFriend', data.user);
        //             // socket.emit('updateChatList', user);
        //         })

        //     })
        // });

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