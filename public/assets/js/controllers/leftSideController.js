app.controller("leftSideController", function ($scope, $location, $rootScope, $http, $window) {
    $("#leftSide").css("height", $window.innerHeight + "px");

    window.onresize = function (event) {
        $("#leftSide").css("height", $window.innerHeight + "px");
    }

    // $scope.showme = false;
    $rootScope.markers = [];

    $rootScope.$on("userUpdated", function () {
        $scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
    });

    $http({
        method: "GET",
        url: "/getInterests",
    }).then(function (response) {
        $scope.interests = response.data;
        $rootScope.interests = $scope.interests;
        $scope.$apply();
    });

    $scope.showSettings = function () {
        $('<div class="modal-backdrop"></div>').appendTo(document.body);
        $rootScope.showSettings = true;
        $rootScope.$broadcast('showSettings');
    };

    $scope.showEventForm = function ($event) {
        $event.preventDefault();
        $('<div class="modal-backdrop"></div>').appendTo(document.body);
        $rootScope.showEventForm = true;
        $rootScope.mapEvents = new google.maps.Map(document.getElementById('mapEvents'), {
            zoom: 12,
            center: new google.maps.LatLng(parseFloat($scope.currentUser.lat), parseFloat($scope.currentUser.lng)),
            // center: { lat: 42.643619, lng: 23.340120 },
            // center: { lat: , lng:  },
            styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#b71c1c" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-23" }, { "lightness": "27" }, { "visibility": "on" }, { "gamma": "1" }, { "hue": "#ff1800" }, { "weight": "0.75" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e74c3c" }, { "saturation": "-59" }, { "lightness": "30" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "on" }, { "hue": "#ff1800" }, { "saturation": "2" }, { "lightness": "2" }, { "weight": "0.75" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "on" }, { "saturation": "-51" }, { "color": "#cbcbcb" }] }, { "featureType": "transit.station", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#2c3e50" }, { "visibility": "on" }] }]
        });
        $rootScope.marker = null;
        $rootScope.$broadcast('showEventForm');
        $rootScope.$broadcast('updatedMapEvents');
    };

    $scope.showMapHideChat = function () {
        $scope.radius = 0;
        $scope.minAge = 16;
        $scope.maxAge = 60;
        $rootScope.showMap = true;
        $rootScope.showChatRoom = false;
        $("#slider").slider({
            value: 0,
            min: 0,
            max: 100,
            step: 1,
            slide: function (event, ui) {
                $scope.radius = ui.value;
                $scope.$apply();
            }
        }).find(".ui-slider-handle").addClass("updated-handle");

        $("#sliderEv").slider({
            value: 0,
            min: 0,
            max: 100,
            step: 1,
            slide: function (event, ui) {
                $scope.radiusEv = ui.value;
                $scope.$apply();
            }
        }).find(".ui-slider-handle").addClass("updated-handle");

        $("#slider-range").slider({
            range: true,
            min: 16,
            max: 60,
            values: [16, 60],
            slide: function (event, ui) {
                $scope.minAge = ui.values[0];
                $scope.maxAge = ui.values[1];
                $scope.$apply();
            }
        }).find(".ui-widget-header").addClass("updated-handle");

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
            $location.path("/");
        });
    };


    // $scope.searchPeopleByName = function () {
    //     var name = $scope.namePerson;
    //     console.log(name);
    //     if (name != "") {
    //         var encodedName = encodeURIComponent(name);
    //         $http({
    //             method: 'GET',
    //             url: '/users' + encodedName
    //         }).then(function (response) {
    //             if (response.data.length > 0) {
    //                 $("ul.dropdown-menu").html("");
    //                 $("ul.dropdown-menu").show();

    //                 Array.prototype.forEach.call(response.data, function (element) {
    //                     var pic = $("<img>");
    //                     pic.src = element.profilePicture;
    //                     var item = $("<li class='row'></li>");
    //                     item.append(pic);
    //                     var name = $("<div></div>").append($("<p></p>").text(element.firstname + " " + element.lastname));
    //                     item.append(name);
    //                     item.append("<hr/>");
    //                     $("ul.dropdown-menu").append(name);
    //                 });
    //                 console.log(response.data);
    //             }
    //         });
    //     }
    // };

    $scope.searchPeople = function () {
        var opositeGender = ($scope.currentUser.gender == "male") ? "female" : "male";
        var gender = ($scope.male == "on" && $scope.female == "on") ? new RegExp(".*male$") : (($scope.male == "on") ? "male" : (($scope.female == "on") ? "female" : opositeGender));

        $http({
            url: "/allUsers",
            method: "POST",
            data: {
                lat: $scope.currentUser.lat,
                lng: $scope.currentUser.lng,
                radius: $scope.radius,
                age: {
                    minAge: $scope.minAge,
                    maxAge: $scope.maxAge
                },
                gender: gender,
                interest: $scope.selectedInterest
            }
        }).then(function (response) {
            $rootScope.markers.forEach(function (mark) {
                mark.setMap(null);
            });
            $rootScope.markers = [];
            response.data.forEach(function (user) {
                if (user._id != $scope.currentUser._id) {
                    var mark = new google.maps.Marker({
                        position: { lat: parseFloat(user.lat), lng: parseFloat(user.lng) },
                        map: $rootScope.map,
                        user: user,
                        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    });

                    mark.addListener('click', function () {
                        $rootScope.markers.forEach(function (mark) {
                            mark.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
                        });
                        mark.setIcon("http://maps.google.com/mapfiles/ms/icons/yellow-dot.png");

                        var self = this;
                        $scope.$apply(function () {
                            $rootScope.user = self.user;
                            $rootScope.userInterests = $scope.interests.filter(function (interest) {
                                for (var index = 0; index < $rootScope.user.interests.length; index++) {
                                    if (interest._id == $rootScope.user.interests[index]) {
                                        return interest;
                                    }
                                }
                            });

                            $rootScope.$broadcast("updateMarkerUser");
                            $("#map").addClass("col-sm-6");
                            $("#map").removeClass("col-sm-9");
                            $(".markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");

                            window.onresize = function (event) {
                                $(".markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");
                            }
                            // google.maps.event.trigger(map, 'resize');
                        });
                    });
                    $rootScope.markers.push(mark);
                }
            });

            var circle = new google.maps.Circle({ radius: $scope.radius * 500, center: { lat: parseFloat($scope.currentUser.lat), lng: parseFloat($scope.currentUser.lng) } });
            $rootScope.map.fitBounds(circle.getBounds());
        });
    };

    $scope.searchEvents = function () {
        $http({
            url: "/findEvents",
            method: "POST",
            data: {
                lat: $scope.currentUser.lat,
                lng: $scope.currentUser.lng,
                radius: $scope.radiusEv,
            }
        }).then(function (response) {
            $rootScope.markers.forEach(function (mark) {
                mark.setMap(null);
            })
            $rootScope.markers = [];
            response.data.forEach(function (event) {
                var mark = new google.maps.Marker({
                    position: { lat: parseFloat(event.lat), lng: parseFloat(event.lng) },
                    map: $rootScope.map,
                    event: event,
                    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                });

                mark.addListener('click', function () {
                    $rootScope.markers.forEach(function (mark) {
                        mark.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
                    });
                    mark.setIcon("http://maps.google.com/mapfiles/ms/icons/purple-dot.png");

                    var self = this;
                    $scope.$apply(function () {
                        $http({
                            method: "POST",
                            url: "/getUsersById",
                            data: {
                                users: self.event["going"]
                            }
                        }).then(function (response) {
                            $rootScope.people = response.data;
                        });
                        $rootScope.event = self.event;
                        $rootScope.$broadcast("updateEventMarker");
                        $("#map").addClass("col-sm-6");
                        $("#map").removeClass("col-sm-9");
                        $("#markEvent").css("height", ($window.innerHeight * 70 / 100) + "px");

                        window.onresize = function (event) {
                            $("#markEvent").css("height", ($window.innerHeight * 70 / 100) + "px");
                        };
                    });
                });
                $rootScope.markers.push(mark);
            });

            var circle = new google.maps.Circle({ radius: $scope.radiusEv * 500, center: { lat: parseFloat($scope.currentUser.lat), lng: parseFloat($scope.currentUser.lng) } });
            $rootScope.map.fitBounds(circle.getBounds());
        });
    };

    // This doesnt WorkerEventMap.. must be in apply
    $scope.missingChatRequests = true;


    // Check if user has chat requests
    if ($scope.currentUser.chatRequests.length !== 0) {
        $scope.missingChatRequests = false;

        var requests = $scope.currentUser.chatRequests;
        for (var index = 0; index < requests.length; index++) {
            $http.get('/getUserInfo' + requests[index])
                .then(function (response) {
                    var user = response.data;
                    $('#lastinvites')
                        .append($('<div>').addClass("invites")
                            .append($('<img>').attr("src", user.profilePicture))
                            .append($('<span>').text(user.firstname + " " + user.lastname + " пожела да започне чат с вас."))
                            .append($('<button>').text('Приеми').click(function () {
                                $http({
                                    'method': 'POST',
                                    'url': '/updateUserFriends',
                                    data: { currentUserId: $scope.currentUser._id, friendId: user._id },
                                })

                                socket.emit('IAcceptRequest', { friend: user, currentUser: $scope.currentUser });

                                $(this).parent().remove();

                                $rootScope.user = user;
                                $rootScope.$broadcast('newFriends');

                                if ($scope.currentUser.chatRequests == []) {
                                    $scope.missingChatRequests = true;
                                }
                            }
                            )));
                })
        }
    }





    // Receive chat request notification -->
    socket.on('receiveChatRequest', function (user) {
        $scope.$apply(function () {
            $scope.missingChatRequests = false;
        })
        $('#lastinvites')
            .append($('<div>').addClass("invites")
                .append($('<img>').attr("src", user.profilePicture))
                .append($('<span>').text(user.firstname + " " + user.lastname + " пожела да започне чат с вас."))
                .append($('<button>').text('Приеми').click(function () {
                    $http({
                        'method': 'POST',
                        'url': '/updateUserFriends',
                        data: { currentUserId: $scope.currentUser._id, friendId: user._id },
                    })

                    socket.emit('IAcceptRequest', { friend: user, currentUser: $scope.currentUser });

                    $(this).parent().remove();

                    $rootScope.user = user;
                    $rootScope.$broadcast('newFriends');

                    if ($scope.currentUser.chatRequests == []) {
                        $scope.missingChatRequests = true;
                    }
                }
                )));
    })
});