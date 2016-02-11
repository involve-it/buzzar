/**
 * Created by ashot on 8/19/15.
 */


//bz.help.maps.initLocation();
//bz.help.maps.initPlaces();

Template.postsPlacesAutoform.created = function () {

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
  var that = this;
  if (this.data._id && this.data.details.locations) {
    _.each(this.data.details.locations, function (el) {
      if (el.placeType === bz.const.locations.type.DYNAMIC) {
        that.$('.choose-place-buttons .panel.js-moving-location-panel').click(); // for editing existing posts, need to just 'click' on moving-loc-btn
      } else {
        that.$('.choose-place-buttons .panel.js-fixed-location-panel');
        location2.isSet = true;
        Session.set(location2.sessionName, el);
        that.$('.choose-place-buttons .panel.js-fixed-location-panel').addClass('callout');

        /*if (this.sessionName === 'bz.control.search.location') {
          searchModalView && Blaze.remove(searchModalView);
          $('.js-global-location').foundation('reveal', 'close');
        } else {
          searchModalView2 && Blaze.remove(searchModalView2);
          $('.js-new-post-location').foundation('reveal', 'close');
        }*/
      }
    });
  }

  Meteor.typeahead.inject();
}
Template.postsPlacesAutoform.helpers({
  placesArray: function () {
    return bz.runtime.maps.places.find().fetch().map(function (object) {
      return {id: object._id, value: object.name};
    });
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
  'click .js-location-holder': function (e, v) {
    e.preventDefault();
  },
  'blur .js-nearby-places': function () {

  },
  'click .choose-place-buttons .panel': function (e, v) {
    if (e.target.nodeName !== "INPUT" && e.target.className.indexOf('tt-suggestion') === -1) { // strange bug
      
      if(e.target.className.indexOf('js-triangle-help') !== -1) {
        return false;
      } else {
        var panel = $(e.currentTarget).closest('.panel');
        panel.toggleClass('callout');
        
        if (panel.hasClass('js-moving-location-panel')) {
          if (panel.hasClass('callout')) {
            location1.isSet = true;
            movingLocationPanelClick();
          } else {
            location1.isSet = false;
          }
        } else if (panel.hasClass('js-fixed-location-panel')) {
          if (panel.hasClass('callout')) {
            location2.isSet = true;
            staticLocationPanelClick(true);
          }else{
            location2.isSet=false;
          }
        }
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