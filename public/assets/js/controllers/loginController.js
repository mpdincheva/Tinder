app.controller("loginController", function($scope, $location, $rootScope, $http){

	$scope.submit = function () {

        var Indata = { 'username': $scope.username, 'password': $scope.password };
        $http.post("http://localhost:3000/login", Indata)
            .then(function (response, status, headers, config) {
                if (response.data != {}) {
					$rootScope.user = response.data;
                    $location.path('/dashboardTinder');
                }
            }, function (response, status, headers, config) {
                alert("error");
            });
    }
});