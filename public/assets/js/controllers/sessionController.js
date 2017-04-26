app.controller('sessionController', function ($scope, $http, $window, $location) {

    $scope.currentSession = function () {
        
        if($window.localStorage.getItem('currentUser')) {
            // Create new socket
            var socket = io.connect('http://localhost:3000');
            $http({
                'method': 'GET',
                'url': '/updateSocket'
            })
            .then(function(response) {
                console.log(response);
            })
            $location.path('/home');
        } else {
            // $location.path('/');
        }
        
        console.log($window.localStorage.getItem('currentUser'));
    }
});