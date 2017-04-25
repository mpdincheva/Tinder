app.controller("leftSideController", function ($scope, $location, $rootScope, $http) {
    $("#leftSide").css("height", window.innerHeight);

    window.onresize = function (event) {
        $("aside").css("height", $(window).height() + "px");
    }

    $scope.showme = false;

    $scope.logout = function () {
		document.cookie = "userid" + '=; Max-Age=0';
		$window.localStorage.removeItem('currentUser');
		// $http({
		// 		method: 'GET',
		// 		url: 'http://localhost:3000/logout/'
		// 	}).then(function (response) {
		// 		console.log(response);
		// 	});
		$scope.$apply(function() {
			$location.path("/");
		});
	};

    $scope.searchPeopleByName = function () {
        var name = $scope.namePerson;
        if (name != "") {
            $http({
                method: 'GET',
                url: 'http://localhost:3000/users/' + name
            }).then(function (response) {
                console.log(response.data);
            });
        }
    };

    $scope.searchPeople = function () {
        // $http({
        // 	url: "http://localhost:3000/users/",
        // 	method: "POST",
        // 	data: {
        // 		radius: $scope.radius,
        // 		gender: {
        // 			male: $scope.male,
        // 			female: $scope.female
        // 		}
        // 	}
        // }).then(function (response) {
        // 	response.data.forEach(function(user) {
        // 		var mark = new google.maps.Marker({
        // 			position: { lat: user.coords.lat, lng: user.coords.lng },
        // 			map: map,
        // 			user: user
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
        // 	})
        // });
    };
});