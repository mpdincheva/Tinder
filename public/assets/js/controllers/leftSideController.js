app.controller("leftSideController", function ($scope, $location, $rootScope, $http, $window) {
    $("#leftSide").css("height", $window.innerHeight + "px");

    window.onresize = function (event) {
        $("#leftSide").css("height", $window.innerHeight + "px");
    }

    // $scope.showme = false;
    $rootScope.markers = [];
    console.log("From left side controller");
    console.log($scope.currentUser);

    $rootScope.$on("userUpdated", function () {
        $scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
    });

    $http({
        method: "GET",
        url: "/getInterests",
    }).then(function (response) {
        $scope.interests = response.data;
        $scope.$apply();
    });

    $scope.showSettings = function () {
        $('<div class="modal-backdrop"></div>').appendTo(document.body);
        $rootScope.showSettings = true;
        $rootScope.$broadcast('showSettings');
    };

    $scope.showEventForm = function (event) {
        $('<div class="modal-backdrop"></div>').appendTo(document.body);
        $rootScope.showEventForm = true;
        $rootScope.$broadcast('showEventForm');
    };

    $scope.showMapHideChat = function () {
        $scope.radius = 0;
        $scope.minAge = 16;
        $scope.maxAge = 60;
        $rootScope.showMap = true;
        $rootScope.showChatRoom = false;
        console.log($("#slider"));
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
            console.log("Changing path!");
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
            // console.log(response.data);
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

                        console.log(this);
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
                            $("#markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");

                            window.onresize = function (event) {
                                $("#markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");
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
            // console.log(response.data);
            $rootScope.markers.forEach(function (mark) {
                mark.setMap(null);
            });
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

                    console.log(this);
                    var self = this;
                    $scope.$apply(function () {
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
        console.log("From chat request:");
        console.log($scope.currentUser.chatRequests);
        for (var index = 0; index < requests.length; index++) {
            $http.get('/getUserInfo' + requests[index])
                .then(function (response) {
                    var user = response.data;
                    $('#lastinvites')
                        .append($('<div>').addClass("invites")
                            .append($('<img>').attr("src", user.profilePicture))
                            .append($('<span>').text(user.firstname + " " + user.lastname + " пожела да започне чат с вас."))
                            .append($('<button>').text('Приеми').click(function () {
                                console.log("You click me.");
                                console.log(user);
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
        console.log("JUST RECEIVE CHAT REQUEST HERE --------");
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