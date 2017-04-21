app.controller("loginController", function($scope, $location, $rootScope, $http){
	$http.get("http://localhost:3000/users")
	.then(function(response){
		$rootScope.users = response.data;

		$scope.submit = function(){
			for (var index = 0; index < $rootScope.users.length; index++) {	
				if($rootScope.users[index].name == $scope.username && $rootScope.users[index].password == $scope.password) {
					$rootScope.user_id = $rootScope.users[index]._id;
					$location.path("/dashboardTinder");
				}
			}
		};
	});
});