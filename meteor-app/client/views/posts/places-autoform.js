/**
 * Created by ashot on 8/19/15.
 */

googlePlacesInit();

Template.postsPlacesAutoform.created = function(){
  googleMapsLoad();
}

Template.postsPlacesAutoform.onRendered(function() {
  this.autorun(function () {
    if (GoogleMaps.loaded() && Session.get('loc')) {
      var map = document.createElement('div');
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: Session.get('loc'),
        radius: 30,
        types: ['store']
      }, callbackNearbySearch);
    }
  });
});
Template.postsPlacesAutoform.rendered = function(){
  Meteor.typeahead.inject();
}
Template.postsPlacesAutoform.helpers({
  placesArray: function(){
    return bz.runtime.maps.places.find().fetch().map(function(it){ return it.name; });
  }
});
// HELPERS:

function googlePlacesInit () {
  bz.runtime.maps = {}
  //if(!Meteor.isCordova) {
  navigator.geolocation.getCurrentPosition(function (a) {
    //bz.runtime.maps.currentGeoposition = a;
    bz.runtime.maps.loc = {
      lat: a.coords.latitude,
      lng: a.coords.longitude
    };
    Session.set('loc', bz.runtime.maps.loc);
  });
  //}
  bz.runtime.maps.places = new Meteor.Collection("maps.places"); // client-side only.
}
function googleMapsLoad(){
  GoogleMaps.load({
    //key: bz.config.mapsKey,
    libraries: 'places'  // also accepts an array if you need more than one
  });
}
function callbackNearbySearch(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.insert(results[i]);
    }
  }
}
// INFO:
// see this for autoforms: https://github.com/sergeyt/meteor-typeahead/, http://typeahead.meteor.com/