/**
 * Created by syurdor on 7/27/2015.
 */
var markers = [];
Template.googleMapControl.helpers({
  mapOptions: function () {
    if (GoogleMaps.loaded()) {
      // Map initialization options
      var coords = new google.maps.LatLng(37.3, -121.8);
      if (bz.runtime.maps.loc){
        coords = bz.runtime.maps.loc;
      }
      return {
        center: coords,
        zoom: 12
      };
    }
  }
});

Template.googleMapControl.onCreated(function () {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('map', function (map) {
    // Add a marker to the map once it's ready
    /*markers.push(new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    }));*/
    load();
  });
});

Template.googleMapControl.events({
  'click #add': function () {
    var map = GoogleMaps.maps.map;

    var latitude = random(bz.runtime.maps.loc.lat-0.1, bz.runtime.maps.loc.lat + 0.1);
    var longitude = random(bz.runtime.maps.loc.lng-0.1, bz.runtime.maps.loc.lng + 0.1);
    markers.push(new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map.instance
    }));
    reposition(map.instance);
  },
  'click #clear': function () {
    var map = GoogleMaps.maps.map;
    for (var i in markers) {
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


// HELPERS:
function random(min, max) {
  return (max - min) * Math.random() + min;
}

function reposition(map) {
  var bounds = new google.maps.LatLngBounds();
  for (var i in markers) {
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

function load(){
  var posts = bz.cols.posts.find().fetch();
  var map = GoogleMaps.maps.map.instance, latitude, longitude;
  var openedWindow;
  _.each(posts, function(post){
    if (post.details && post.details.locations && post.details.locations.length > 0) {
      latitude = post.details.locations[0].coords.lat;
      longitude = post.details.locations[0].coords.lng;
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        title: post.details.title
      });

      var infoWindow = new google.maps.InfoWindow({
        content: '<h3>' + post.details.title + '</h3>' + post.details.description
      });
      marker.addListener('click', function(){
        if (openedWindow){
          openedWindow.close();
        }
        infoWindow.open(map, marker);
        openedWindow = infoWindow;
      });

      markers.push(marker);
    }
  });
  reposition(map);

  console.log('done');

}