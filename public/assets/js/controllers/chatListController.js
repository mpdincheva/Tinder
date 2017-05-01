app.controller("chatListController", function ($scope, $timeout, $http, $window, $rootScope) {
    if ($scope.currentUser.friends == 0) {
        $scope.nofriends = true;
    } else {
        $scope.nofriends = false;
        $http.get('/getFriends')
            .then(function (response) {
                $scope.friends = response.data;


                // var friends = response.data;
                // for(var index = 0; index < friends.length; index++) {
                //     console.log("In the for loop: My friends looks like:")
                //     console.log(index);
                //     $('#friends-container')
                //         .append($('<div class="col-sm-3" id="' + friends[index]._id +'">')
                //             .append($('<div class="col-sm-12">')
                //                 .append($('<img src="' + friends[index].profilePicture + '" class=col-sm-6" width="50%">')))
                //             .append($('<div class="col-sm-12">')
                //                 .append($('<h3 class=col-sm-12>').text(friends[index].firstname + " " + friends[index].lastname)))

                //             .append($('<div class="col-sm-12">')
                //                 .append($('<button class="btn" ng-click="startChat(' + friends[index]._id +')">').text('Напиши съобщение'))));
                // }




                // Set status of each friend
                // for (var index = 0; index < $scope.friends.length; index++) {
                //     if ($scope.friends[index].socketId) {
                //         var selector = 'friendStatus' + index;
                //         console.log(selector);
                //         console.log($('#' + selector))
                //         $('#' + selector).text('Онлайн');
                //     } else {
                //         $('#' + selector).text('Отсъства');
                //     }
                // }
            })
    }

    // $scope.search="";
    // $scope.filterFriends = function () {
    //     return $scope.friends.filter(function (friend) {
    //         return (friend.firstname.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 || friend.lastname.toLowerCase().indexOf($scope.search.toLowerCase()) > -1)
    //     });
    // };



    socket.on('friendAcceptMyRequest', function (user) {
        console.log("This user just accept my friend request:")
        console.log(user);
        $scope.$apply(function () {
            $scope.friends.push(user);
            console.log("My new friends are: ");
            console.log($scope.friends);
        })
    })

    socket.emit('getAllUnseenMessages', $scope.currentUser);

    socket.on('receiveAllUnseenMessages', function (messages) {
        console.log("From client when receive the messages..");
        console.log(messages);
    });


    $rootScope.$on('newFriends', function () {
        console.log("From chat list controller. My new friends are");
        // console.log($rootScope.friends);
        $scope.$apply(function () {
            $scope.friends.push($rootScope.user);
            console.log("My new friends are: ");
            console.log($scope.friends);
        })
    });

    $scope.startChat = function (index) {
        // Gets the id of clicked user-->
        var friend_id = $scope.friends[index]._id;
        console.log($scope.friends[index]._id);

        // $scope.chatWith = !$scope.chatWith;
        // $scope.showMe = true;

        // When start chat must show info about the user
        $rootScope.$broadcast("showme");

        $rootScope.showMap = false;
        $rootScope.showChatRoom = true;
        // $rootScope.friendId = friend_id;

        // Attach friend to $rootScope
        console.log("From chat list controller:-----------");
        console.log(friend_id);
        $http.get("/getUserInfo" + friend_id)
            .then(function (response) {
                $rootScope.friend = response.data;
                $rootScope.$broadcast("friendUpdated");

                // $rootScope.user = response.data;
                $rootScope.$broadcast("chooseFriendToChat");
            });

        $rootScope.$broadcast('showUpdated');

        // Get all messages between currentUser and his friend
        $http.get('/allMessagesBetween' + friend_id)
            .then(function (response) {
                $('#message-container').html('');
                console.log("In get all messages between");
                console.log(response.data);
                response.data.forEach(function (message) {
                    if (message.fromUserId == $scope.currentUser._id) {
                        // messagesFromMe.push(message);
                        $('#message-container')
                            .append($('<li>').addClass("message-from-me")
                                .append($('<li>').addClass("text-message")
                                    .append($('<span>').text(message.message)))
                                .append($('<li>').addClass("img-box")
                                    .append($('<img>').attr("src", $scope.currentUser.profilePicture))));

                    } else {
                        // messagesFromFriend.push(message);
                        $('#message-container')
                            .append($('<li>').addClass("message-from-friend")
                                .append($('<li>').addClass("img-box")
                                    .append($('<img>').attr("src", $rootScope.friend.profilePicture)))
                                .append($('<li>').addClass("text-message")
                                    .append($('<span>').text(message.message))));
                    }
                })
            })
            // Catch database or server errors
            .catch(function (err) {
                console.log(err);
            })

    };




    // Set status to every friend when the page load
    $http.get('/getFriends')
        .then(function (response) {
            // $scope.friends = response.data;
            // Set status of each friend
            var friends = response.data;
            for (var index = 0; index < friends.length; index++) {
                var selector = 'friendStatus' + index;
                if (friends[index].socketId) {
                    console.log(selector);
                    console.log($('#' + selector))
                    $('#' + selector).text('Онлайн');
                } else {
                    $('#' + selector).text('Отсъства');
                }
            }
        })

    socket.on('offlineFriend', function (user) {
        console.log("This user is offline now");
        console.log(user);
        $('#' + user._id + " > div > span").text('Офлайн');
    })


    socket.on('onlineFriend', function (user) {
        console.log("Somebody just came online");
        console.log(user);
        $('#' + user._id + " > div > span").text('Онлайн');
    })

})









