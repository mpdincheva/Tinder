var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "./assets/views/login.htm"
		})
		.when("/dashboardTinder", {
			resolve: {
				"check": function ($location, $rootScope) {
					console.log(document.cookie)
					if (!document.cookie) {
						$location.path("/");
					}
				}
			},
			templateUrl: "./assets/views/dashboardTinder.htm"
		})
		.when("/registration", {
			templateUrl: "./assets/views/registration.htm"
		})
		.when("/account",{
			templateUrl: "./assets/views/account.htm"
		})
		.otherwise({
			redirectTo: './assets/views/login.htm'
		});
});

