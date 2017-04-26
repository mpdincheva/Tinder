app.controller("chatListController", function ($scope, $http, $window) {



    if ($scope.currentUser.friends == 0) {
        $scope.nofriends = true;
    } else {
        $scope.nofriends = false;
        $http.get('/getFriends')
            .then(function (response) {
                $scope.friends = response.data;
                console.log(response.data);
            })
    }

    $scope.startChat = function (index) {
        // Gets the id of clicked user-->
        console.log("You clicked startChat");
        var friend_id = $scope.currentUser.friends[index];

        // $scope.chatWith = !$scope.chatWith;
        // $scope.friendId = friend_id;

        $scope.showMap = false;
        $scope.showChatRoom = true;

        // http.
        // var friend = data;
        // $scope.name = friend.name;
    };
})









