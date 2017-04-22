app.controller("loginController", function ($scope, $location, $rootScope, $http) {

    $scope.submit = function () {

        if ($scope.username != undefined && $scope.password != undefined) {
            $scope.error = false;
            var Indata = { 'username': $scope.username, 'password': $scope.password };
           
            $http.post("http://localhost:3000/login", Indata)
                .then(function (response, status, headers, config) {
                    console.log('Eto me az sum datata');
                    console.log(response.data);
                    
                    if (response.data !== "") {
                        console.log($rootScope);
                        $rootScope.user = response.data;
                        $location.path('/dashboardTinder');
                    }

                }, function (response, status, headers, config) {
                    alert("error");
                });
        } else {
            $scope.errorMessage = "Моля попълнете полетата за име и парола";
            $scope.error = true;
        }
    }

    $scope.facebook = function() {
        console.log("KLikna mee");
        $http.get('/auth/facebook')
            .then( function(response, status, headers, config) {
                console.log("Come back with the response");
                    console.log(response.data);
        })
    }

    // <a href="/auth/facebook">Facebook</a>
});