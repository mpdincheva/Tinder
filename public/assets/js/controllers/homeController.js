app.controller("homeController", function ($scope, $location, $window, $http, $rootScope) {
	
	console.log("From home controller");
	$scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
	console.log($scope.currentUser);

	$scope.showMap = true;
	$scope.showChatRoom = false;

	$rootScope.$on('showUpdated', function () {
		$scope.showMap = $rootScope.showMap;
		$scope.showChatRoom = $rootScope.showChatRoom;
	});

	$rootScope.$on('showSettings', function () {
		$scope.showSettings = $rootScope.showSettings;
	});
	
	$rootScope.$on('showEventForm', function () {
		$scope.showEventForm = $rootScope.showEventForm;
	});
});


