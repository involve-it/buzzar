/**
 * Created by Ashot on 9/8/15.
 */
/*Template.bzControlSearch.rendered = function () {

}
Template.bzControlSearch.events({
  'keydown .js-search-text': function (e, v) {
    debugger;
    if (!isOn) {
      v.$('.js-search-posts-link').click();
      $('.js-search-text-modal').val($('.js-search-text').val())
      $('.js-search-text-modal').focus();
    }
  }
});*/


Template.bzControlSearch.created = function () {
  debugger;
  bz.help.maps.initLocation();
  bz.help.maps.initPlaces();
  // doc.ready happened, so:
  bz.help.maps.googleMapsLoad();
}

Template.bzControlSearch.onRendered(function () {

  Meteor.typeahead.inject();


  this.autorun(function () {
    if (GoogleMaps.loaded() && Session.get('loc')) {
      var map = document.createElement('div');
      debugger;
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: Session.get('loc'),
        radius: 1000,
        types: ['store']
      }, callbackNearbySearch);
    }
  });
});

Template.bzControlSearch.helpers({
  placesArray: function () {
    debugger;
    return bz.runtime.maps.places.find().fetch().map(function(object){ return {id: object._id, value: object.name}; });
  },
  selected: function (event, suggestion, datasetName) {
    var mapsPlaceId = suggestion && suggestion.id;
    bz.runtime.newPost.location.mapsPlaceId = mapsPlaceId;
    // make it look selected:
    $('.js-location-nearby').addClass('selected');
  }
});
Template.bzControlSearch.events({
  'click .js-current-location-a': function (e, v) {
    debugger;

    v.$('.js-current-location-a').toggleClass('button-clear');
    if (v.$('.js-current-location-a').hasClass('button-clear')) {
      bz.runtime.newPost.location.current = false;
    } else {
      bz.runtime.newPost.location.current = true;
    }
  },
  'blur .js-nearby-places': function(){
  }
})

// HELPERS:

function callbackNearbySearch(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.insert(results[i]);
    }
  }
}