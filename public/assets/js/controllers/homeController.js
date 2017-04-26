app.controller("homeController", function ($scope, $location, $window, $http, $rootScope) {
	if (!$window.localStorage.getItem("currentUser")) {
		$rootScope.$on('localStorageUpdated', function () {
			var currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
			$scope.currentUser = currentUser;
		})
	} else {
		var currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
		$scope.currentUser = currentUser;
	}

	$scope.showMap = true;
	$scope.showChatRoom = false;

	$rootScope.$on('showUpdated', function () {
		$scope.showMap = $rootScope.showMap;
		$scope.showChatRoom = $rootScope.showChatRoom;
	});
});


