var chatService = require('./chatService');

var userService = require('./userService');
module.exports = function (app, passport) {

    var onlineUsers = [];

    app.io = require('socket.io')();


    app.io.on('connection', function (socket) {


        socket.on('updateSocket', function (data) {
            // data is the full current person object


            userService.updateSocket(data.user._id, socket.id);

            // Get all online friends
            userService.getAllOnlineUsers(data.user.friends, function (err, myFriends) {

                myFriends.forEach(function (friend) {
                    app.io.to(friend.socketId).emit('onlineFriend', data.user);
                })
            });

        })

        socket.on('new-msg', function (data) {
            chatService.insertMessage(data.fromUser._id, data.toUser._id, data.msg);

            userService.getUsersSockets(data.fromUser._id, data.toUser._id, function (fromUser, toUser) {
                app.io.to(fromUser.socketId).to(toUser.socketId)
                    .emit('new-msg', { 'fromUserId': data.fromUser._id, 'message': data.msg });
            })
        });


        // Send chat request notification
        socket.on('sendChatNotification', function (data) {
            userService.findUserById(data.toUser._id, function (err, user) {
                app.io.to(user.socketId).emit('chatNotification', data.fromUser)
            })
        })

        socket.on('sendTypingNotification', function (data) {
            userService.findUserById(data.fromUser, function (err, user) {
                app.io.to(user.socketId).emit('sendTypingNotification', data.toUser);
            })
        })


        socket.on('sendChatRequest', function (data) {
            // data contains: fromUser: $scope.currentUser, toUser: $scope.user

            userService.updateChatRequests(data.fromUser._id, data.toUser._id);
            
            userService.getUsersSockets(data.fromUser._id, data.toUser._id, function (fromUser, toUser) {
                app.io.to(toUser.socketId).emit('receiveChatRequest', fromUser)
            });

        });

        socket.on('IAcceptRequest', function (data) {
            // data contains: friend and currentUser

            // userService.addNewFriend(data.currentUser._id, data.friend._id);
            userService.getUsersSockets(data.currentUser._id, data.friend._id, function (fromUser, toUser) {
                app.io.to(toUser.socketId).emit('friendAcceptMyRequest', data.currentUser);
            })
        })



        socket.on('seenAllMessages', function (data) {
            // data contains fromUser and toUser
            chatService.setAllMessagesSeen(data.fromUser._id, data.toUser._id);
            app.io.to(data.toUser.socketId).emit('allMessagesAreSeen', data.fromUser);
        })

        socket.on('getAllUnseenMessages', function (currentUser) {
            chatService.getAllUnseenMessages(currentUser._id, function (messages) {
                socket.emit('receiveAllUnseenMessages', messages);
            })
        })


        // Must delete socket id from database
        socket.on('disconnect', function () {

            userService.findUserBySocketId(socket.id, function (user) {
                userService.getAllOnlineUsers(user.friends, function (err, myFriends) {

                    myFriends.forEach(function (friend) {
                        app.io.to(friend.socketId).emit('offlineFriend', user);
                        // socket.emit('updateChatList', user);
                    })
                });

            })
            userService.findAndUpdateSocketId(socket.id);

            // userService.findAndUpdateSocketId(socket.id, function (user) {
            //     console.log("Updated user is:");
            //     console.log(user);
            //     console.log(user.friends);
            //     userService.getAllOnlineUsers(user.friends, function (err, myFriends) {
            //         console.log("My all friends are:");
            //         console.log(myFriends);
            //         myFriends.forEach(function (friend) {
            //             console.log("My online friends are:  ");
            //             console.log(friend);
            //             app.io.to(friend.socketId).emit('offlineUser', data.user);
            //         })

            //     })
            // })


        });


        // userService -> Find all my friends which are online



    })
}