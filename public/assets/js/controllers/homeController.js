app.controller("homeController", function ($scope, $location, $window, $http) {
	var currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
	$scope.currentUser = currentUser;
});

