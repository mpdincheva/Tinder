app.controller("moreInfoController", function ($rootScope, $scope, $http) {
    $rootScope.$on("updateMarkerUser", function () {
        $scope.userInterests = $rootScope.userInterests;
        console.log($scope.userInterests);
        $scope.user = $rootScope.user;
        $scope.showme = true;

        $scope.alreadySent = false;
        $scope.isFriend = false;
        $scope.chatRequestButton = true;

        if ($scope.user.socketId !== "") {
            $scope.userIsOnline = true;
            $scope.userIsOffline = false;
        } else {
            $scope.userIsOnline = false;
            $scope.userIsOffline = true;
        }

        // Check if the user is already my friend
        for (var index = 0; index < $scope.currentUser.friends.length; index++) {
            if ($scope.user._id == $scope.currentUser.friends[index]) {
                $scope.isFriend = true;
                $scope.chatRequestButton = false;
                $scope.alreadySent = false;
                break;
            }
        }
        // Check if already send chat request
        for (var index = 0; index < $scope.currentUser.sendedChatRequests.length; index++) {
            if ($scope.user._id == $scope.currentUser.sendedChatRequests[index]) {
                console.log("You already send chat request to this user");
                $scope.alreadySent = true;
                $scope.isFriend = false;
                $scope.chatRequestButton = false;
                break;
            }
        }
    });

    $rootScope.$on("chooseFriendToChat", function () {
        $scope.user = $rootScope.friend;
        $scope.showme = true;

        $scope.alreadySent = false;
        $scope.isFriend = false;
        $scope.chatRequestButton = false;

        if ($scope.user.socketId !== "") {
            $scope.userIsOnline = true;
            $scope.userIsOffline = false;
        } else {
            $scope.userIsOnline = false;
            $scope.userIsOffline = true;
        }
    });




    $('#sendChatRequest').on('click', function () {
        console.log("Chat request is SENT FROM-------------");
        console.log($scope.currentUser);
        console.log("Chat request MUST BE TO-------------");
        console.log($scope.user);
        socket.emit('sendChatRequest', { fromUser: $scope.currentUser, toUser: $scope.user });
        $scope.$apply(function () {
            $scope.alreadySent = true;
            $scope.isFriend = false;
            $scope.chatRequestButton = false;
        })
        // $('#sendChatRequest').text('Вие изпратихте покана за приятелство за този потребител')
    })


    $("#closeInformation").on("click", function () {
        $scope.$apply(function () {
            console.log("You clicked close information button");
            $scope.showme = false;
            console.log($scope.showme);
            $("#map").removeClass("col-sm-6");
            $("#map").addClass("col-sm-9");
        });

        $rootScope.markers.forEach(function (mark) {
            mark.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        });
        // google.maps.event.trigger(map, 'resize');
    });
});
