/**
 * Created by syurdor on 7/27/2015.
 */

    /**
     * collection : [{
     *    coords: {
     *      lat: 0,
     *      lng: 0
     *    },
     *    type: 0,
     *    title: '',
     *    data: {}
     * }, ...]
    * */

var module = {
  markers: [],
  map: null,
  load: function(collection){
    //Tracker.autorun(function () {
    // use this for reactivity, todo: change for finding only posts around user:
    //bz.cols.posts.find().count();

    //bz.bus.search.doSearch(function(err, res){
    // safely delete existing:
    module.deleteMarkers();

    // create markers:
    module.createMarkersFromCollection(collection);

    //module.setMapOnAll(markersArr, googleMap);

    module.reposition();
    //});
    //});
  },
  random: function(min, max){
    return (max - min) * Math.random() + min;
  },
  reposition: function(){
    var bounds = new google.maps.LatLngBounds();
    //for (var i in module.markers) {
    //  bounds.extend(module.markers[i].position);
    //}
    var location = Session.get('bz.control.search.location') && Session.get('bz.control.search.location').coords,
        radius = Session.get('bz.control.search.distance') || bz.const.locations.defaultDistance;

    if (location) {
      var dLat = (radius / bz.const.locations.earthRadius) / Math.PI * 180,
          dLng = (radius / bz.const.locations.earthRadius / Math.cos(location.lat * Math.PI / 180)) / Math.PI * 180;
      var box = {
        lng1: location.lng - dLng,
        lng2: location.lng + dLng,
        lat1: location.lat - dLat,
        lat2: location.lat + dLat
      };

      bounds.extend(new google.maps.LatLng(box.lat1, box.lng1));
      bounds.extend(new google.maps.LatLng(box.lat2, box.lng2));
    }

    module.map.fitBounds(bounds);
  },
  createMarkersFromCollection: function(collection){
    var defColor = 'FE7569';
    _.each(collection, function (item) {
      if (item && item.coords) {
        var latitude = item.coords.lat && item.obscuredCoords.lat,
            longitude = item.coords.lng && item.obscuredCoords.lng,
            infoWindow = new google.maps.InfoWindow({
              content: '<h4>' + item.title + '</h4>'
            }),
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(latitude, longitude),
              title: item.title,
              icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + (module.getRgb(item.type) || defColor),
              data: item.data,  // our field,
              map: module.map,
              infoWindow: infoWindow
            });

        marker.addListener('click', module.markerClickHandler);

        module.markers.push(marker);
      } else {
      }
    });
  },
  getRgb: function(str){
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var c = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  },
  markerClickHandler: function(){
    for(var i = 0; i<module.markers.length; i++){
      if (module.markers[i] && module.markers[i].infoWindow){
        module.markers[i].infoWindow.close();
      }
    }
    if (this.infoWindow){
      this.infoWindow.open(module.map, this);
    }
    Session.set('search.selectedPost', this.data);
  },
  deleteMarkers: function(){
    for (var i = 0; i < module.markers.length; i++) {
      if (module.markers[i]) {
        if (module.markers[i].infoWindow){
          module.markers[i].infoWindow.close();
        }
        module.markers[i].marker.setMap(null);
      }

    }
    module.markers = [];
  }
};

bz.help.makeNamespace('bz.runtime.googleMap', module);

Template.googleMapControl.helpers({
  mapOptions: function () {
    if (GoogleMaps.loaded()) {
      // Map initialization options
      var coords = new google.maps.LatLng(37.3, -121.8);
      if (bz.runtime.maps.loc) {
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


    //instead of doing this - call bz.runtime.googleMap.load(collection) to show markers on the map.
    module.map = map.instance;
    var posts = bz.cols.posts.find().fetch();

    var col = [];
    _.each(posts, function(post){
      if (post && post.details && post.details.locations && Array.isArray(post.details.locations) && post.details.locations.length > 0){
        col.push({
          coords: post.details.locations[0].coords,
          type: post.type,
          title: post.details.title,
          data: post
        });
      }
    });

    module.load(col);
  });
});
Template.googleMapControl.onDestroyed(function () {
  console.log('googleMapControl.onDestroyed');
});

// HELPERS:

