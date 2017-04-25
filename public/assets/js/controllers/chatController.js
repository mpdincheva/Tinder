app.controller("chatController", function ($scope, $http, $window) {


        var currentUser = JSON.parse($window.localStorage.getItem('currentUser'));

        if(currentUser.friends == 0) {
            $scope.nofriends = true;
        } else {
            $scope.nofriends = false;
            $http({
                method: 'get',
                url: '/getFriends' + currentUser._id,
            })
            .then(function(response) {
                $scope.friends = response.data;
                console.log(response.data);
            })
        }

        console.log(currentUser);
        $scope.chatWith = false;
    $scope.startChat = function(index){
        // Gets the id of clicked user-->
        var friend_id = currentUser.friends[index];
        $scope.chatWith = !$scope.chatWith;
        $scope.friendId = friend_id;

            $http({
                method: 'get',
                url: '/getFriends' + currentUser._id,
            })
            .then(function(response) {
                $scope.friends = response.data;
                console.log(response.data);
            })

        // http.
        // var friend = data;
        // $scope.name = friend.name;
    };
})









  