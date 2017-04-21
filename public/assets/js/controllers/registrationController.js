app.controller("registrationController", function($scope, $location, $rootScope){
	$scope.registration = function(){

		for (var index = 0; index < $rootScope.users.length; index++) {
			if($rootScope.users[index].username == $scope.regUsername) {
				var hasUserName = true;
			}
		}

		if(!hasUserName) {
			$rootScope.users.push({username: $scope.regUsername, password: $scope.regPassword })
			$rootScope.user_id = $rootScope.users.length;
			$location.path("/dashboardTinder");
		}
		
	};
});