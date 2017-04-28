app.controller("mapController", function ($scope, $location, $rootScope, $http) {

    function getPosition(position) {
        $http({
            method: "POST",
            url: "/updatePosition",
            data: {
                lat: parseFloat(position.coords.latitude),
                lng: parseFloat(position.coords.longitude)
            }
        }).then(function () {
            console.log("Zapazeni");
            $scope.currentUser.lat = parseFloat(position.coords.latitude);
            $scope.currentUser.lng = parseFloat(position.coords.longitude);
            $rootScope.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: { lat:  $scope.currentUser.lat, lng:  $scope.currentUser.lng},
                styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#b71c1c" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-23" }, { "lightness": "27" }, { "visibility": "on" }, { "gamma": "1" }, { "hue": "#ff1800" }, { "weight": "0.75" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e74c3c" }, { "saturation": "-59" }, { "lightness": "30" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "on" }, { "hue": "#ff1800" }, { "saturation": "2" }, { "lightness": "2" }, { "weight": "0.75" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "on" }, { "saturation": "-51" }, { "color": "#cbcbcb" }] }, { "featureType": "transit.station", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#2c3e50" }, { "visibility": "on" }] }]
            });
            var marker = new google.maps.Marker({
                position: { lat:  $scope.currentUser.lat, lng:  $scope.currentUser.lng},
                map: $rootScope.map
            });
        });
    }

    (function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition);
        }
    })();

    $("#closeInformation").on("click", function () {
        $scope.$apply(function () {
            $scope.showme = !$scope.showme;
            $("#map").toggleClass("small");
            $("#map").toggleClass("large");
        });
        google.maps.event.trigger(map, 'resize');
        // map.setCenter({ lat: x.lat, lng: x.lng });
    });

    $rootScope.$on("updateMarkerUser", function(){
        $scope.user = $rootScope.user;
        $scope.showme = true;
    })

    $('#sendChatNotification').on('click', function() {
        console.log("You clicked start chat button");
        socket.emit('sendChatNotification', {'fromUser': $scope.currentUser, 'toUser': $scope.user})
    })

    socket.on('chatNotification', function(user) {
        console.log("Somebody wants to start chat with you.");
        console.log(user);
    })
});
