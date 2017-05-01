app.controller("eventsController", function ($scope, $window, $http, $rootScope, $location) {
    $scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));

    console.log($scope.currentUser);
    var mapEvents = new google.maps.Map(document.getElementById('mapEvents'), {
        zoom: 12,
        center: { lat: 42.664950700000006, lng: 23.287522199999998 },
        styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#b71c1c" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-23" }, { "lightness": "27" }, { "visibility": "on" }, { "gamma": "1" }, { "hue": "#ff1800" }, { "weight": "0.75" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e74c3c" }, { "saturation": "-59" }, { "lightness": "30" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "on" }, { "hue": "#ff1800" }, { "saturation": "2" }, { "lightness": "2" }, { "weight": "0.75" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "on" }, { "saturation": "-51" }, { "color": "#cbcbcb" }] }, { "featureType": "transit.station", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#2c3e50" }, { "visibility": "on" }] }]
    });
    var marker = null;

    google.maps.event.addListener(mapEvents, 'click', function (event) {
        if(marker != null){
            marker.setMap(null);
        }

        marker = new google.maps.Marker({
            position: {lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng())},
            map:mapEvents
        });
        
    });

    $scope.closeForm = function($event){
        $event.preventDefault;
        $rootScope.showEventForm = false;
        $rootScope.$broadcast('showEventForm');
        $(".modal-backdrop").remove();
        // $location.path( "/home");
    };

    $scope.saveEvent = function(){
        console.log($scope.dateEvent);
        $http({
           url: "/saveEvent",
           method:"POST", 
           data: {
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng(),
                name: $scope.nameEvent,
                date: $scope.dateEvent,
                description: $scope.desc,
                createdby: $scope.currentUser._id
           } 
        }).then(function(response){
            console.log("Done");
        });
    }

});