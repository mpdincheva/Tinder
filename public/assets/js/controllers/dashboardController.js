app.controller("dashboardController", function ($scope, $location, $rootScope, $http) {
	$("aside").css("height", window.innerHeight);

	function degreesToRadians(degrees) {
		return degrees * Math.PI / 180;
	}

	function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
		var earthRadiusKm = 6371;

		var dLat = degreesToRadians(lat2 - lat1);
		var dLon = degreesToRadians(lon2 - lon1);

		lat1 = degreesToRadians(lat1);
		lat2 = degreesToRadians(lat2);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return earthRadiusKm * c;
	}

	$scope.showme = false;
	console.log($rootScope);
	$scope.currentUser = $rootScope.user;
	console.log($scope.currentUser);
	console.log(document.cookie);
	$scope.logout = function () {
		document.cookie = userid + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		$rootScope.user_id = 0;
		$location.path("/");
	};

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: { lat: Number($scope.currentUser.coords.lat), lng: Number($scope.currentUser.coords.lng) },
		// styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"hue":"#ff0000"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#ff0000"}]}]
		styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#b71c1c" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-23" }, { "lightness": "27" }, { "visibility": "on" }, { "gamma": "1" }, { "hue": "#ff1800" }, { "weight": "0.75" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e74c3c" }, { "saturation": "-59" }, { "lightness": "30" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "on" }, { "hue": "#ff1800" }, { "saturation": "2" }, { "lightness": "2" }, { "weight": "0.75" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "on" }, { "saturation": "-51" }, { "color": "#cbcbcb" }] }, { "featureType": "transit.station", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#2c3e50" }, { "visibility": "on" }] }]
	});

	// for (var index = 0; index < $rootScope.users.length; index++) {
	// 	if (distanceInKmBetweenEarthCoordinates($scope.currentUser.coords.lat, $scope.currentUser.coords.lng, $rootScope.users[index].coords.lat, $rootScope.users[index].coords.lng) < 30) {
	// 		var mark = new google.maps.Marker({
	// 			position: { lat: $rootScope.users[index].coords.lat, lng: $rootScope.users[index].coords.lng },
	// 			map: map,
	// 			user: $rootScope.users[index]
	// 		});

	// 		mark.addListener('click', function () {
	// 			var self = this;
	// 			$scope.$apply(function () {
	// 				$scope.showme = true;
	// 				$scope.user = self.user;
	// 				$("#map").addClass("small");
	// 				$("#map").removeClass("large");
	// 				google.maps.event.trigger(map, 'resize');
	// 				map.setCenter({ lat: $scope.currentUser.position.lat, lng: $scope.currentUser.position.lng });
	// 			});
	// 		});
	// 	}
	// }

	// $("#closeInformation").on("click", function () {
	// 	$scope.$apply(function () {
	// 		$scope.showme = !$scope.showme;
	// 		$("#map").toggleClass("small");
	// 		$("#map").toggleClass("large");
	// 	});
	// 	google.maps.event.trigger(map, 'resize');
	// 	map.setCenter({ lat: $scope.currentUser.position.lat, lng: $scope.currentUser.position.lng });
	// });

	// $scope.searchPeopleByName = function () {
	// 	var name = $scope.namePerson;
	// 	if (name != "") {
	// 		$http({
	// 			method: 'GET',
	// 			url: 'http://localhost:3000/users/' + name
	// 		}).then(function (response) {
	// 			console.log(response.data);
	// 		});
	// 	}
	// };
});

