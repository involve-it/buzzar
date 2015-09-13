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
Template.myPlacesPopover.events({
  'click .js-my-place-item': function (e, v) {
    bz.runtime.newPost.location.selectedMyPlaceId = this._id;
    $('.js-my-places-button').text(this.name);
    $('.js-my-places-button').removeClass('button-clear');
    $('.js-my-places-button').addClass('button-calm');
    $(e.target).addClass('selected');

    try {
      IonPopover.hide();
    } catch (ex) {
    }
  },
  'mousedown .js-my-place-item': function (e, v) {
    $(e.target).addClass('selected');
  }
});
Template.myPlacesPopover.helpers({
  getMyPlaces: function () {
    var places = [
      {name: 'place 1', _id: '1'},
      {name: 'place 1', _id: '2'},
      {name: 'place 1', _id: '3'},
      {name: 'place 1', _id: '4'},
      {name: 'place 1', _id: '5'},
      {name: 'place 2', _id: '6'}
    ];
    return places;
  }
});

// HELPERS:

function callbackNearbySearch(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.insert(results[i]);
    }
  }
}
// INFO:
// see this for autoforms: https://github.com/sergeyt/meteor-typeahead/, http://typeahead.meteor.com/