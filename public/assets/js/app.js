var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			resolve: {
				"check": function ($location) {
					if (document.cookie) {
						$location.path("/home");
					}
				}
			},
			templateUrl: "./assets/views/index.htm"
		})
		.when("/home", {
			resolve: {
				"check": function ($location) {
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

