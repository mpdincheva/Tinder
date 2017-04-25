app.controller("mapController", function ($scope, $location, $rootScope, $http) {

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

    var map;

    function showPosition(position) {

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: { lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude) },
            styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#b71c1c" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-23" }, { "lightness": "27" }, { "visibility": "on" }, { "gamma": "1" }, { "hue": "#ff1800" }, { "weight": "0.75" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e74c3c" }, { "saturation": "-59" }, { "lightness": "30" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "on" }, { "hue": "#ff1800" }, { "saturation": "2" }, { "lightness": "2" }, { "weight": "0.75" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "on" }, { "saturation": "-51" }, { "color": "#cbcbcb" }] }, { "featureType": "transit.station", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#2c3e50" }, { "visibility": "on" }] }]
        });
    }

    (function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    })();

    $("#closeInformation").on("click", function () {
        $scope.$apply(function () {
            $scope.showme = !$scope.showme;
            $("#map").toggleClass("small");
            $("#map").toggleClass("large");
        });
        google.maps.event.trigger(map, 'resize');
        map.setCenter({ lat: x.lat, lng: x.lng });
    });
});
