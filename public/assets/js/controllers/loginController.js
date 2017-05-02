app.controller("loginController", function ($scope, $location, $window, $http) {
    $("#login-form").css("height", $window.innerHeight + "px");

    $scope.submit = function () {

        if ($scope.username != undefined && $scope.password != undefined) {
            $scope.error = false;
            var Indata = { 'username': $scope.username, 'password': $scope.password };

            $http.post("/login", Indata)
                .then(function (response, status, headers, config) {

                    if (response.data !== "") {
                        $window.localStorage.setItem('currentUser', JSON.stringify(response.data));

                        // Create global variable for socket
                        socket = io.connect('http://localhost:3000');
                        socket.emit('updateSocket', { user: response.data });
                        $location.path('/home');
                    }

                }, function (response, status, headers, config) {
                    $scope.errorMessage = "Сгрешени потребителско име или парола";
                    $scope.error = true;

                });
        } else {
            $scope.errorMessage = "Моля попълнете полетата за име и парола";
            $scope.error = true;
        }
    }

});