app.controller("moreInfoEventController", function ($scope, $rootScope, $http) {
    function updateGoing() {
        $http({
            method: "POST",
            url: "/getUsersById",
            data: {
                users: $scope.event["going"]
            }
        }).then(function (response) {
            $scope.event["going"] = response.data;
            console.log($scope.event["going"]);
        });
    }
    $rootScope.$on("updateEventMarker", function () {
        $scope.event = $rootScope.event;
        $scope.event["date"] = new Date($scope.event["date"]).toDateString();

        if ($scope.event["going"]) {

            var isGoing = $scope.event["going"].find(function (userid) {
                return userid == $scope.currentUser._id;
            });
        } else {
            var isGoing = false;
        }

        if (isGoing) {
            $scope.going = true;
        }

        $http({
            method: "GET",
            url: "/getUser" + $scope.event.createdby
        }).then(function (response) {
            $scope.event["createdByUser"] = response.data;
        });

        updateGoing();
        $scope.showmeEvent = true;
    });

    $("#closeInformationEvent").on("click", function () {
        $scope.$apply(function () {
            $scope.showmeEvent = false;
            $("#map").removeClass("col-sm-6");
            $("#map").addClass("col-sm-9");
        });

        $rootScope.markers.forEach(function (mark) {
            mark.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
        });
        // google.maps.event.trigger(map, 'resize');
    });

    $scope.addMe = function () {
        console.log("ddsds");
        $http({
            method: "POST",
            url: "/addUserToEvent",
            data: {
                user: $scope.currentUser._id,
                event: $scope.event._id
            }
        }).then(function (response) {
            $scope.going = true;
            $scope.event["going"] = response.data["going"];
            updateGoing();
        });
    };

    $scope.removeMe = function () {
        $http({
            method: "POST",
            url: "/removeUserFromEvent",
            data: {
                user: $scope.currentUser._id,
                event: $scope.event._id
            }
        }).then(function (response) {
            $scope.going = false;
            console.log(response.data["going"]);
            $scope.event["going"] = response.data["going"];
            updateGoing();            
        });
    }
});