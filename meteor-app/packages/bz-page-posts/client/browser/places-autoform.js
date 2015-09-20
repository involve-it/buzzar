/**
 * Created by ashot on 8/19/15.
 */


//bz.help.maps.initLocation();
//bz.help.maps.initPlaces();

bz.help.makeNamespace('bz.runtime.newPost.location');

Template.postsPlacesAutoform.created = function () {
  bz.help.maps.initLocation();
  bz.help.maps.initPlaces();
  // doc.ready happened, so:
  bz.help.maps.googleMapsLoad();
}

Template.postsPlacesAutoform.onRendered(function () {
  this.autorun(function () {
    if (GoogleMaps.loaded() && Session.get('bz.api.loc')) {
      var map = document.createElement('div');
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: Session.get('bz.api.loc'),
        radius: 300,
        types: ['store']
      }, callbackNearbySearch);
    }
  });
  $(document).foundation();
});
Template.postsPlacesAutoform.rendered = function () {
  Meteor.typeahead.inject();
}
Template.postsPlacesAutoform.helpers({
  placesArray: function () {
    return bz.runtime.maps.places.find().fetch().map(function(object){ return {id: object._id, value: object.name}; });
  },
  selected: function (event, suggestion, datasetName) {
    var mapsPlaceId = suggestion && suggestion.id;
    bz.runtime.newPost.location.mapsPlaceId = mapsPlaceId;
    // make it look selected:
    $('.js-location-nearby').addClass('selected');
  }
});
Template.postsPlacesAutoform.events({
  'click .js-current-location-a': function (e, v) {
    v.$('.js-current-location-a').toggleClass('selected');  //button-clear
    if (v.$('.js-current-location-a').hasClass('selected')) {
      bz.runtime.newPost.location.current = true;
    } else {
      bz.runtime.newPost.location.current = false;
    }
  },
  'blur .js-nearby-places': function(){

  }
})
// HELPERS:

function callbackNearbySearch(results, status) {
  console.log('results: ', results);
  console.log('status: ', status);
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.insert(results[i]);
    }
  }
}
// INFO:
// see this for autoforms: https://github.com/sergeyt/meteor-typeahead/, http://typeahead.meteor.com/