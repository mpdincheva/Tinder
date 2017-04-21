var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "./assets/views/login.htm"
		})
		.when("/dashboardTinder", {
			resolve: {
				"check": function ($location, $rootScope) {
					if (!$rootScope.user_id) {
						$location.path("/");
					}
				}
			},
			templateUrl: "./assets/views/dashboardTinder.htm"
		})
		.when("/registration", {
			templateUrl: "./assets/views/registration.htm"
		})
		.otherwise({
			redirectTo: './assets/views/login.htm'
		});
});

