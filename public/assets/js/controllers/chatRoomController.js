app.controller("chatRoomController", function ($scope, $http, $window, $rootScope) {
    $rootScope.$on('friendUpdated', function () {
		$scope.friendId = $rootScope.friendId;
	});
});
