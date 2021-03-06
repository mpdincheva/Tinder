app.controller("moreInfoController", function ($rootScope, $scope, $http) {
    $rootScope.$on("updateMarkerUser", function () {
        $scope.userInterests = $rootScope.userInterests;
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
                $scope.alreadySent = true;
                $scope.isFriend = false;
                $scope.chatRequestButton = false;
                break;
            }
        }
    });

    $rootScope.$on("chooseFriendToChat", function () {
        $scope.user = $rootScope.friend;
        $scope.userInterests = $rootScope.userInterests;
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




    $('#sendChatRequest').on('click', function (event) {
        socket.emit('sendChatRequest', { fromUser: $scope.currentUser, toUser: $scope.user });
        $scope.$apply(function () {
            $scope.alreadySent = true;
            $scope.isFriend = false;
            $scope.chatRequestButton = false;
        });
        event.stopImmediatePropagation();
        // $('#sendChatRequest').text('Вие изпратихте покана за приятелство за този потребител')
    })


    $("#closeInformation").on("click", function (event) {
        $scope.$apply(function () {
            $scope.showme = false;
            $("#map").removeClass("col-sm-6");
            $("#map").addClass("col-sm-9");

        });

        $rootScope.markers.forEach(function (mark) {
            mark.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        });
        event.stopImmediatePropagation();
    });
});



