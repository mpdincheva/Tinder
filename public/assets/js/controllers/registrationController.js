app.controller("registrationController", function ($scope, $window, $location, $rootScope, $http) {
	$("#register-form").css("height", $window.innerHeight + "px");

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
				$http.post("/register", Indata)
					.then(function (response, status, headers, config) {
						if (response.data !== "") {
							$window.localStorage.setItem("currentUser", JSON.stringify(response.data));
							$location.path("/account");
						}
					}, function (err) {
						if (err) {
							$scope.error = true;
							$scope.errorMessage = "Вече има регистриран потребител с този и-мейл";
						}
					})
			}

		};
	}
});
