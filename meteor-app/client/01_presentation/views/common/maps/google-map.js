/**
 * Created by syurdor on 7/27/2015.
 */
var markersArr = [];
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
    load();
  });
});
Template.googleMapControl.onDestroyed(function () {
  console.log('googleMapControl.onDestroyed');
});

// HELPERS:
function random(min, max) {
  return (max - min) * Math.random() + min;
}

function reposition(markers, map) {
  var bounds = new google.maps.LatLngBounds();
  for (var i in markers) {
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
 window.l = load;
function load() {

  Tracker.autorun(function () {
    // use this for reactivity, todo: change for finding only posts around user:
    bz.cols.posts.find().count();
    var query = Session.get('runtime.searchText'),
        posts,
        map = GoogleMaps.maps.map.instance, latitude, longitude,
        activeCats = Session.get('bz.control.category-list.activeCategories');
    if (!query && query === undefined) {
      query = '';
    }
    Meteor.call('search', query, activeCats, {}, function (err, res) {
      posts = res;

      // safely delete existing:
      deleteMarkers(markersArr);

      // create markers:
      createMarkersFromPosts(posts, markersArr);

      setMapOnAll(markersArr, map);

      reposition(markersArr, map);
    });
    //}
  });
}
window.clear = function(){
  deleteMarkers(markers);

}
function createMarkersFromPosts(posts, markers){
  var defColor = 'FE7569';
  _.each(posts, function (post) {
    if (post.details && post.details.locations && post.details.locations.length > 0) {
      latitude = post.details.locations[0].coords.lat;
      longitude = post.details.locations[0].coords.lng;
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        title: post.details.title,
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + (intToRGB(hashCode(post.type)) || defColor),
        data: post  // our field
      });
      console.log(post.type.color);
      marker.addListener('click', markerClickHandler);

      markers.push(marker);
    } else {
    }
  });
}
function removeEventListenersFromMarkers (markers){
  if (markers && Array.isArray(markers)) {
    _.each(markers, function(i, item){

    })
  }
}
function markerClickHandler(post){
  Session.set('search.selectedPost', this.data);
}
// Sets the map on all markers in the array.
function setMapOnAll(markers, map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Shows any markers currently in the array.
function showMarkers(markers, map) {
  setMapOnAll(markers, map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers(markers) {
  setMapOnAll(markers, null);
  //removeEventListenersFromMarkers(markers); //todo
  markers.length = 0;
}
// temp helpers:
function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i){
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}