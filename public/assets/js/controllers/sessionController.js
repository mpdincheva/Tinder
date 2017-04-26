app.controller('sessionController', function ($scope, $http, $window, $location, $rootScope) {

    $scope.currentSession = function () {

        // if($window.localStorage.getItem('currentUser')) {

        // if the userid - cookie is defined ->
        // if (document.cookie) {
        //     // Create new socket
        //     console.log("Give me user Id");
        //     if($rootScope.currentUser) {
        //         $location.path('/home');
        //     }else {
        //     // $rootScope.currentUser = 
        //     $http.get('/getAllInfoForMe')
        //         .then(function (response) {
        //             console.log("From session controller");
        //             console.log(response.data);
        //             $rootScope.currentUser = response.data;
        //             console.log($rootScope);
        //             var socket = io.connect('http://localhost:3000');
        //             socket.emit('updateSocket', { userId: $rootScope.currentUser._id });
        //             $location.path('/home');
        //         })
        //     }


        // var currentuserId = document.cookie.substr(14, 24);
        if (document.cookie) {

            if (!$window.localStorage.getItem('currentUser')) {
                $http.get('/getAllInfoForMe')
                    .then(function (response) {
                        $window.localStorage.setItem('currentUser', JSON.stringify(response.data));
                        $rootScope.$broadcast('localStorageUpdated');
                        var socket = io.connect('http://localhost:3000');
                        socket.emit('updateSocket', { userId: JSON.parse($window.localStorage.getItem("currentUser"))._id });
                        console.log("When login from facebook: ");
                        console.log(JSON.parse($window.localStorage.getItem("currentUser"))._id);
                    })
            } else {
                var socket = io.connect('http://localhost:3000');
                socket.emit('updateSocket', { userId: JSON.parse($window.localStorage.getItem("currentUser"))._id });
                console.log("When login locally");
                console.log(JSON.parse($window.localStorage.getItem("currentUser"))._id);
            }
        } else {
            $location.path('/');
        }

        // console.log($window.localStorage.getItem('currentUser'));
    }
});