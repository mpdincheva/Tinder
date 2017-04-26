app.controller("chatListController", function ($scope, $timeout, $http, $window, $rootScope) {

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
        $rootScope.showMap = false;
        $rootScope.showChatRoom = true;
        $rootScope.friendId = friend_id;
        
        $rootScope.$broadcast("friendUpdated");
        $rootScope.$broadcast('showUpdated');
        
        // http.
        // var friend = data;
        // $scope.name = friend.name;
    };
})









