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
				console.log(Indata);
				$http.post("/register", Indata)
					.then(function (response, status, headers, config) {
						console.log(response.data);
						if (response.data !== "") {
							$window.localStorage.setItem("currentUser", JSON.stringify(response.data));
							$location.path("/account");
						}
						console.log("The status code is:");
						console.log(status);
					}, function (err) {
						if (err) {
							$scope.error = true;
							$scope.errorMessage = "Вече има регистриран потребител с този и-мейл";
						}
						console.log(err);
					})
			}

		};
	}
});
