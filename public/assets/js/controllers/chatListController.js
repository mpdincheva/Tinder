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



            })
    }

    // $scope.search="";
    // $scope.filterFriends = function () {
    //     return $scope.friends.filter(function (friend) {
    //         return (friend.firstname.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 || friend.lastname.toLowerCase().indexOf($scope.search.toLowerCase()) > -1)
    //     });
    // };



    socket.on('friendAcceptMyRequest', function (user) {
        $scope.$apply(function () {
            $scope.friends.push(user);
        })
    })

    socket.emit('getAllUnseenMessages', $scope.currentUser);

    socket.on('receiveAllUnseenMessages', function (messages) {
    });


    $rootScope.$on('newFriends', function () {
        $scope.$apply(function () {
            $scope.friends.push($rootScope.user);
        })
    });

    $scope.startChat = function (index) {

        $(".markPerson").eq(1).css("height", ($window.innerHeight * 70 / 100) + "px");

        window.onresize = function (event) {
            $(".markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");
        }


        // Gets the id of clicked user-->
        var friend_id = $scope.friends[index]._id;

        // $scope.chatWith = !$scope.chatWith;
        // $scope.showMe = true;

        // When start chat must show info about the user
        $rootScope.$broadcast("showme");

        $rootScope.showMap = false;
        $rootScope.showChatRoom = true;
        // $rootScope.friendId = friend_id;

        // Attach friend to $rootScope
        $http.get("/getUserInfo" + friend_id)
            .then(function (response) {
                $scope.interests = $rootScope.interests;
                $rootScope.friend = response.data;
                $rootScope.userInterests = $scope.interests.filter(function (interest) {
                    for (var index = 0; index < $rootScope.friend.interests.length; index++) {
                        if (interest._id == $rootScope.friend.interests[index]) {
                            return interest;
                        }
                    }
                });
                $rootScope.$broadcast("friendUpdated");

                // $rootScope.user = response.data;
                $rootScope.$broadcast("chooseFriendToChat");
            });

        $rootScope.$broadcast('showUpdated');

        // Get all messages between currentUser and his friend
        $http.get('/allMessagesBetween' + friend_id)
            .then(function (response) {
                $('#message-container').html('');
                response.data.forEach(function (message) {
                    if (message.fromUserId == $scope.currentUser._id) {
                        // messagesFromMe.push(message);
                        $('#message-container')
                            .append($('<li>').addClass("message-from-me")
                                .append($('<span>').text(message.message))
                                .append($('<img>').attr("src", $scope.currentUser.profilePicture)));

                    } else {
                        // messagesFromFriend.push(message);
                        $('#message-container')
                            .append($('<li>').addClass("message-from-friend")
                                .append($('<img>').attr("src", $rootScope.friend.profilePicture))
                                .append($('<span>').text(message.message)));
                    }
                })
            })
            // Catch database or server errors
            .catch(function (err) {
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
                    $('#' + selector).text('Онлайн');
                } else {
                    $('#' + selector).text('Отсъства');
                }
            }
        })

    socket.on('offlineFriend', function (user) {
        $('#' + user._id + " > div > span").text('Офлайн');
    })


    socket.on('onlineFriend', function (user) {
        $('#' + user._id + " > div > span").text('Онлайн');
    })

})









