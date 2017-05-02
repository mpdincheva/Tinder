app.controller("eventsController", function ($scope, $window, $http, $rootScope, $location) {

    $rootScope.$on('updatedMapEvents', function () {
        $scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
        $scope.marker = $rootScope.marker;
        $scope.mapEvents = $rootScope.mapEvents;
        google.maps.event.addListener($scope.mapEvents, 'click', function (event) {
            if ($scope.marker != null) {
                $scope.marker.setMap(null);
            }

            $scope.marker = new google.maps.Marker({
                position: { lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng()) },
                map: $scope.mapEvents
            });

        });

        $scope.closeForm = function ($event) {
            $event.preventDefault;
            $rootScope.showEventForm = false;
            $rootScope.$broadcast('showEventForm');
            $(".modal-backdrop").remove();
        };

        $scope.saveEvent = function () {
            $http({
                url: "/saveEvent",
                method: "POST",
                data: {
                    lat: $scope.marker.getPosition().lat(),
                    lng: $scope.marker.getPosition().lng(),
                    name: $scope.nameEvent,
                    date: $scope.dateEvent,
                    description: $scope.desc,
                    createdby: $scope.currentUser._id
                }
            }).then(function (response) {
                $rootScope.showEventForm = false;
                $rootScope.$broadcast('showEventForm');
                $(".modal-backdrop").remove();
            });
        }
    });

});