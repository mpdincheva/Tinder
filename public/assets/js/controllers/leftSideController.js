app.controller("leftSideController", function ($scope, $location, $rootScope, $http, $window) {
    $("#leftSide").css("height", window.innerHeight);

    window.onresize = function (event) {
        $("aside").css("height", $(window).height() + "px");
    }

    $scope.showme = false;

    console.log("From left side controller");
    console.log($scope.currentUser);

    $scope.showMapHideChat = function () {
        $rootScope.showMap = true;
        $rootScope.showChatRoom = false;

        $rootScope.$broadcast('showUpdated');
    };

    $scope.logout = function () {
        $http({
            method: "POST",
            url: "/updatePosition",
            data: {
                id: $scope.currentUser._id,
                lat: "",
                lng: ""
            }
        });

        document.cookie = "userid" + '=; Max-Age=0';
        $window.localStorage.removeItem('currentUser');

        $scope.$apply(function () {
            console.log("Changing path!");
            $location.path("/");
        });
    };

    $scope.searchPeopleByName = function () {
        var name = $scope.namePerson;
        console.log(name);
        if (name != "") {
            var encodedName = encodeURIComponent(name);
            $http({
                method: 'GET',
                url: '/users' + encodedName
            }).then(function (response) {
                if (response.data.length > 0) {
                    $("ul.dropdown-menu").html("");
                    $("ul.dropdown-menu").show();
                    
                    Array.prototype.forEach.call(response.data, function(element){
                        var pic = $("<img>");
                        pic.src = element.profilePicture;
                        var item = $("<li class='row'></li>");
                        item.append(pic);
                        var name = $("<div></div>").append($("<p></p>").text(element.firstname + " " + element.lastname))     ;
                        item.append(name);
                        item.append("<hr/>");
                        $("ul.dropdown-menu").append(name);
                    });
                    console.log(response.data);
                }
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