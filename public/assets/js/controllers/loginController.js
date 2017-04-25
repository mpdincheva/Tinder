app.controller("loginController", function ($scope, $location, $window, $http) {

    $scope.submit = function () {

        if ($scope.username != undefined && $scope.password != undefined) {
            $scope.error = false;
            var Indata = { 'username': $scope.username, 'password': $scope.password };

            $http.post("http://localhost:3000/login", Indata)
                .then(function (response, status, headers, config) {

                    if (response.data !== "") {
                        console.log(response.data);                 
                        $window.localStorage.setItem('currentUser', JSON.stringify(response.data));
                        // $rootScope.user = response.data;
                        console.log($window.localStorage.getItem("currentUser"));
                        $location.path('/home');
                    }

                }, function (response, status, headers, config) {
                    alert("error");
                });
        } else {
            $scope.errorMessage = "Моля попълнете полетата за име и парола";
            $scope.error = true;
        }
    }

    // $scope.facebook = function () {
    //     console.log("KLikna mee");
    //     $http.get('/auth/facebook')
    //         .then(function (response, status, headers, config) {
    //             console.log("Come back with the response");
    //             console.log(response.data);
    //         })
    // }
});