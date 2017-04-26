app.controller("eventsController", function () {
    var myLatlng = { lat: 42.68748287866539, lng: 23.308181762695312 };

    var map = new google.maps.Map(document.getElementById('mapEvents'), {
        zoom: 12,
        center: myLatlng
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });

    map.addListener('click', function (e) {
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
        marker.setMap(null);
        placeMarkerAndPanTo(e.latLng, this);
    });

    function placeMarkerAndPanTo(latLng, map) {
        marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
    }

});