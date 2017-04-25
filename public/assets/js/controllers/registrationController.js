app.controller("registrationController", function ($scope, $location, $rootScope, $http) {
	$scope.submit = function () {

		if ($scope.firstName == undefined || $scope.lastName == undefined || $scope.email == undefined || $scope.password == undefined || $scope.repeatedPassword == undefined) {
			$scope.error = true;
			$scope.errorMessage = "Моля попълнете всички полета";
		} else {
			if ($scope.password !== $scope.repeatedPassword) {
				$scope.error = true;
				$scope.errorMessage = "Паролите не съвпадат";
			} else {
				var Indata = {
					'firstName': $scope.firstName,
					'lastName': $scope.lastName,
					'email': $scope.email,
					'password': $scope.password
				}
				console.log(Indata);
				$http.post("http://localhost:3000/register", Indata)
					.then(function (response, status, headers, config) {
						console.log(response);
						// $location.path("/account");
					})
			}

		};
	}
});
