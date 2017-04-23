var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "./assets/views/index.htm"
		})
		.when("/home", {
			resolve: {
				"check": function ($location, $rootScope) {
					console.log(document.cookie)
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
		.otherwise({
			redirectTo: './assets/views/index.htm'
		});
});

