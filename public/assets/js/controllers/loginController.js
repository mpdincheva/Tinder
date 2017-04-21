app.controller("loginController", function($scope, $location, $rootScope, $http){

	$scope.submit = function () {

        var Indata = { 'username': $scope.username, 'password': $scope.password };
        $http.post("http://localhost:3000/login", Indata)
            .then(function (response, status, headers, config) {
				console.log('Eto me az sum datata');
                console.log(response.data);
                if (response.data) {
					console.log($rootScope);
					$rootScope.user = response.data;
                    $location.path('/dashboardTinder');
                }
                // console.log(response);
            }, function (response, status, headers, config) {
                alert("error");
            });
    }
});