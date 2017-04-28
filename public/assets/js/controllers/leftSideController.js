app.controller("leftSideController", function ($scope, $location, $rootScope, $http, $window) {
    $("#leftSide").css("height", window.innerHeight);

    window.onresize = function (event) {
        $("aside").css("height", $(window).height() + "px");
    }

    $scope.showme = false;

    console.log("From left side controller");
    console.log($scope.currentUser);

    $http({
        method: "GET",
        url: "/getInterests",
    }).then(function (response) {
        $scope.interests = response.data;
        $scope.$apply();
    });

    $scope.showMapHideChat = function () {
        $rootScope.showMap = true;
        $rootScope.showChatRoom = false;
        console.log($("#slider"));
        $("#slider").slider({
            value: 0,
            min: 0,
            max: 50,
            step: 1,
            slide: function (event, ui) {
                $scope.radius = ui.value;
            }
        }).find(".ui-slider-handle").addClass("updated-handle");
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

                    Array.prototype.forEach.call(response.data, function (element) {
                        var pic = $("<img>");
                        pic.src = element.profilePicture;
                        var item = $("<li class='row'></li>");
                        item.append(pic);
                        var name = $("<div></div>").append($("<p></p>").text(element.firstname + " " + element.lastname));
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
        console.log($scope.radius);
        console.log($scope.male);
        console.log($scope.female);
        console.log($scope.selectedInterest);

        var gender = ($scope.male == "on") ? "male" : "female";
        $http({
            url: "/allUsers",
            method: "POST",
            data: {
                radius: $scope.radius,
                gender: gender,
                interest: $scope.selectedInterest
            }
        }).then(function (response) {
            console.log(response.data);
            response.data.forEach(function (user) {
                var mark = new google.maps.Marker({
                    position: { lat: parseFloat(user.lat), lng: parseFloat(user.lng) },
                    map: $rootScope.map,
                    user: user
                });

                mark.addListener('click', function () {
                    var self = this;
                    $scope.$apply(function () {
                        $rootScope.user = self.user;
                        $rootScope.$broadcast("updateMarkerUser");
                        $("#map").addClass("small");
                        $("#map").removeClass("large");
                        google.maps.event.trigger(map, 'resize');
                        // map.setCenter({ lat: $scope.currentUser.position.lat, lng: $scope.currentUser.position.lng });
                    });
                });
            })
        });
    };
});