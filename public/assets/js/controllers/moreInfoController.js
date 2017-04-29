app.controller("moreInfoController", function ($rootScope, $scope) {
    $rootScope.$on("updateMarkerUser", function () {
        $scope.userInterests = $rootScope.userInterests;
        console.log($scope.userInterests);
        $scope.user = $rootScope.user;
        $scope.showme = true;
    });

    $("#closeInformation").on("click", function () {
        $scope.$apply(function () {
            $scope.showme = false;
            $("#map").removeClass("col-sm-6");
            $("#map").addClass("col-sm-9");
        });

        $rootScope.markers.forEach(function (mark) {
            mark.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        });
        // google.maps.event.trigger(map, 'resize');
    });
});