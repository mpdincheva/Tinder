app.controller("chatListController", function ($scope, $timeout, $http, $window, $rootScope) {
    if ($scope.currentUser.friends == 0) {
        $scope.nofriends = true;
    } else {
        $scope.nofriends = false;
        $http.get('/getFriends')
            .then(function (response) {
                $scope.friends = response.data;
            })
    }
    
    // $scope.search="";
    // $scope.filterFriends = function () {
    //     return $scope.friends.filter(function (friend) {
    //         return (friend.firstname.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 || friend.lastname.toLowerCase().indexOf($scope.search.toLowerCase()) > -1)
    //     });
    // };

    $scope.startChat = function (index) {
        // Gets the id of clicked user-->
        var friend_id = $scope.friends[index]._id;
        console.log($scope.friends[index]._id);

        // $scope.chatWith = !$scope.chatWith;
        $scope.showMe = true;
        $rootScope.showMap = false;
        $rootScope.showChatRoom = true;
        $rootScope.friendId = friend_id;

        $rootScope.$broadcast("friendUpdated");
        $rootScope.$broadcast('showUpdated');

        // Get all messages between them
        $http.get('/allMessagesBetween' + $rootScope.friendId)
            .then(function (response) {
                $rootScope.messages = response.data;
            })
            // Catch database or server errors
            .catch(function (err) {
                console.log(err);
            })

        // http.
        // var friend = data;
        // $scope.name = friend.name;
    };
})









