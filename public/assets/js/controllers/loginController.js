app.controller("loginController", function ($scope, $location, $window, $http) {

    $scope.submit = function () {

        if ($scope.username != undefined && $scope.password != undefined) {
            $scope.error = false;
            var Indata = { 'username': $scope.username, 'password': $scope.password };

            $http.post("http://localhost:3000/login", Indata)
                .then(function (response, status, headers, config) {

                    if (response.data !== "") {
                        // console.log(response.data);                 
                        // $window.localStorage.setItem('currentUser', JSON.stringify(response.data));
                        // $rootScope.user = response.data;
                        // console.log($window.localStorage.getItem("currentUser"));
                        $window.localStorage.setItem('currentUser', JSON.stringify(response.data));
                        console.log("In the login controlleeeeeeeeeer:");
                        // Create global variable for socket
                        socket = io.connect('http://localhost:3000');
                        socket.emit('updateSocket', { user: response.data });
                        console.log(socket);
                        $location.path('/home');
                    }

                }, function (response, status, headers, config) {
                    alert("Сгрешени потребителско име или парола");
                });
        } else {
            $scope.errorMessage = "Моля попълнете полетата за име и парола";
            $scope.error = true;
        }
    }

});