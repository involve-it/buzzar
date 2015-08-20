/**
 * Created by syurdor on 7/27/2015.
 */
var markers = [];
Template.postsMap.helpers({
    mapOptions: function(){
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(-37.8136, 144.9631),
                zoom: 8
            };
        }
    }
});

Template.postsMap.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('map', function(map) {
        // Add a marker to the map once it's ready
        markers.push(new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        }));
    });
});

function random(min, max){
    return (max - min) * Math.random() + min;
}

function reposition(map){
    var bounds = new google.maps.LatLngBounds();
    for(var i in markers){
        bounds.extend(markers[i].position);
    }
    map.instance.fitBounds(bounds);
}

Template.postsMap.events({
    'click #add': function(){
        var map = GoogleMaps.maps.map;

        var latitude = random(-43, -10);
        var longitude = random(113, 153);
        markers.push(new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map.instance
        }));
        reposition(map);
    },
    'click #clear': function(){
        var map = GoogleMaps.maps.map;
        for(var i in markers){
            markers[i].setMap(null);
        }
        markers = [];

        //var cameraUpdate = google.maps.CameraUpdateFactory.newLatLng(new google.maps.LatLng(-37.8136, 144.9631));
        map.instance.setCenter(new google.maps.LatLng(-37.8136, 144.9631));
        markers.push(new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        }));
        map.instance.setZoom(8);
    }
});

