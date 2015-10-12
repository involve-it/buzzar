/**
 * Created by ashot on 8/19/15.
 */


//bz.help.maps.initLocation();
//bz.help.maps.initPlaces();

Template.postsPlacesAutoform.created = function () {
  bz.help.maps.initLocation();
  bz.help.maps.initPlacesCollection();
  // doc.ready happened, so:
  bz.help.maps.googleMapsLoad();
}

Template.postsPlacesAutoform.onRendered(function () {
  this.autorun(function () {
    if (GoogleMaps.loaded() && Session.get('bz.api.maps.recentLoc')) {
      var map = document.createElement('div');
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: Session.get('bz.api.maps.recentLoc'),
        radius: 2 // km, 1.24 miß
        //types: ['store']
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
  'click .js-location-holder': function(e, v){
    e.preventDefault();
  },
  'blur .js-nearby-places': function(){

  },
  'click .choose-place-buttons .panel': function(e,v){
    if(e.target.nodeName !== "INPUT" && e.target.className.indexOf('tt-suggestion') === -1) { // strange bug
      var panel = $(e.currentTarget).closest('.panel');
      panel.toggleClass('callout');
      if(panel.hasClass('js-moving-location-panel')){
        if(panel.hasClass('callout')){
          location1.isSet = true;
          movingLocationPanelClick();
        } else {
          location1.isSet = false;
        }
      } else if(panel.hasClass('js-fixed-location-panel')){
        location2.isSet = true;
        staticLocationPanelClick();
      } else {
        location2.isSet = false;
      }
    }
  }
})
// HELPERS:

function callbackNearbySearch(results, status) {
  console.log('results: ', results);
  console.log('status: ', status);
  console.log('length: ', results.length);
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.insert(results[i]);
    }
  }
}
// INFO:
// see this for autoforms: https://github.com/sergeyt/meteor-typeahead/, http://typeahead.meteor.com/