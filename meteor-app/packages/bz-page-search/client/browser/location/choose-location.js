/**
 * Created by root on 9/23/15.
 */
Template.bzLocationName.helpers({
  getCurrentLocationName: function(){
    var ret = Session.get('bz.control.search.location');
    return ret && ret.name || 'Location is not defined';
  }
})
Template.bzLocationName.rendered = function () {
  setInterval(function () {
    $(document).off('open.fndtn.reveal', '[data-reveal]');
    $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
      $('.js-location-modal-holder').empty();
      searchModalView = Blaze.renderWithData(Template.bzChooseLocationModal, {}, $('.js-location-modal-holder')[0]);
      Session.set('bz.search.searchModalView');
      //var modal = $(this); bzChooseLocationModal
    });
    //$(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
    //});
  }, 1000);
}
Template.bzChooseLocationModal.created = function () {
  Meteor.subscribe('locations-my');
};
Template.bzChooseLocationModal.rendered = function () {
  Meteor.typeahead.inject();
};
Template.bzChooseLocationModal.destroyed = function () {
}
Template.bzChooseLocationModal.events({
  'click .js-set-location-button': function (e, v) {
    //var that = this;
    //Tracker.nonreactive(function () {
    var locName = $('.js-location-name-input.tt-input').val()
    setLocationFromData(locName, v.data);
    Blaze.remove(searchModalView);
    $('#choose-locations').foundation('reveal', 'close');
  },
  'click .js-locations-list a': function (e, v) {

    var locName, locId;
    locName = e.target.dataset.locationname;
    if (locName) {
      $('.js-location-name-input.tt-input').val(locName);
    }
    var locId = e.target.dataset.locationid;
    if (locId) {
      v.data.locationId = locId;
    }
  },
  'typeahead:select .js-location-name-input': function (e, v, val) {
    var placeObj = {}, textName = val.name && val.name.trim() || '';
    if (val.searchEngine && val.searchEngine === 'google') {
      // this is google place:
      placeObj = bz.cols.locations.insertFromGoogleObject(val);
    } else {
      placeObj = val;
    }
    v.data.selectedPlace = placeObj;

    Session.set('bz.control.search.searchedText', textName);
    $('.js-nearby-places').typeahead('close');
    $('.js-nearby-places').blur();
  }
});

Template.bzChooseLocationModal.helpers({
  placesArray: function () {
    var ret = [
      {
        name: 'google-places',
        valueKey: 'name',
        displayKey: 'name',
        template: 'googlePlacesItem',
        header: '<h3 class="league-name">Google Places Nearby</h3>',
        local: function () {
          ret = bz.runtime.maps.places.find({searchEngine: 'google'}).fetch().map(function (item) {
            return item;
          });

          return ret;
        }
      },
      {
        name: 'yelp-places',
        valueKey: 'name',
        displayKey: 'name',
        template: 'googlePlacesItem',
        header: '<h3 class="league-name">Yelp Places Nearby</h3>',
        local: function () {
          ret = bz.runtime.maps.places.find().fetch().map(function (item) {
            return item;
          });

          return ret;
        }
      },
      {
        name: 'my-places',
        valueKey: 'name',
        displayKey: 'name',
        template: 'googlePlacesItem',
        header: '<h3 class="league-name">My Saved Places</h3>',
        local: function () {
          ret = bz.cols.locations.find().fetch().map(function (item) {
            //return {id: item._id, value: item.name};
            return item;
          });

          return ret;
        }
      }
    ];
    return ret;
  },
  getCurrentLocationName: function () { //FromSearchControl
    return Session.get('bz.control.search.location') && Session.get('bz.control.search.location').name;
  },
  getUserLocations: function () {
    var ret;
    if (Meteor.userId()) {

      ret = bz.cols.locations.find({
        userId: Meteor.userId()
      });
    }
    return ret;
  },
  getPopularPlacesAround: function () {

  }/*,
   locationItemSelected: function (event, suggestionObj, datasetName) {
   //var mapsPlaceId = suggestionObj && suggestionObj.id;
   //bz.runtime.newPost.location.mapsPlaceId = mapsPlaceId;
   // make it look selected:
   //v.data.selectedPlace = val;
   var data = Template.currentData(event.target);
   data.selectedPlace = suggestionObj;

   $('.js-location-nearby').addClass('selected');
   }*/
});