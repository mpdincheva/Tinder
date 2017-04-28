var app = angular.module("myapp", ["ngRoute"]);

// app.run(function ($http, $window, $rootScope) {
// 	if (document.cookie) {
// 		console.log("In app.service for getting all info for current user");
// 		$http.get('/getAllInfoForMe').then(function (response) {
// 			console.log("zapazwam user-a");
// 			console.log(response.data);
// 			$window.localStorage.setItem('currentUser', JSON.stringify(response.data));
// 			var socket = io.connect('http://localhost:3000');
// 			socket.emit('updateSocket', { userId: JSON.parse($window.localStorage.getItem("currentUser")) });
// 			var socket = io.connect('http://localhost:3000');
// 			$rootScope.socket = socket;
// 			// Send user on socket ------->
// 			socket.emit('updateSocket', { userId: JSON.parse($window.localStorage.getItem("currentUser")) });
// 			$rootScope.$broadcast('localStorageUpdated');
// 		}).catch(function (err) {
// 			console.log(err);
// 		});
// 	}
// });

// app.service('getCurrentUser', ['$http', '$window', function ($http, $window) {
// 	console.log("In app.service for getting all info for current user");
// 	$http.get('/getAllInfoForMe').then(function (response) {
// 		console.log("zapazwam user-a");
// 		console.log(response);
// 		$window.localStorage.setItem('currentUser', JSON.stringify(response.data));
// 	}).catch(function(err){
// 		console.log(err);	
// 	});
// }]);

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
		.when("/account", {
			templateUrl: "./assets/views/account.htm"
		})
		.when("/events", {
			templateUrl: "./assets/views/eventsSettings.htm"
		})
		.otherwise({
			templateUrl: './assets/views/index.htm'
		});
});

