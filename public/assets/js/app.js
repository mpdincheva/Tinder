var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "./assets/views/index.htm"
		})
		.when("/home", {
			resolve: {
				"check": function ($location, $rootScope) {
					if (!document.cookie) {
						$location.path("/");
					}
				}
			},
			templateUrl: "./assets/views/home.htm"
		})
		.when("/account",{
			templateUrl: "./assets/views/account.htm"
		})
		.when("/events",{
			templateUrl: "./assets/views/eventsSettings.htm"
		})
		.otherwise({
			templateUrl: './assets/views/index.htm'
		});
});

