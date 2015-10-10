/**
 * Created by root on 9/23/15.
 */
Template.bzLocationName.helpers({
  getCurrentLocationName: function(){
    var ret = Session.get('bz.control.search.location');
    debugger;
    return ret && ret.name || 'Location is not defined';
  }
})
Template.bzLocationName.rendered = function () {
  setTimeout(function () {
    $(document).off('open.fndtn.reveal', '[data-reveal].js-global-location');
    $(document).on('open.fndtn.reveal', '[data-reveal].js-global-location', function () {
      $('.js-location-modal-holder-global').empty();
      searchModalView = Blaze.renderWithData(Template.bzChooseLocationModal, {}, $('.js-location-modal-holder-global')[0]);
      //Session.set('bz.search.searchModalView');
      //var modal = $(this); bzChooseLocationModal
    });
    //$(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
    //});
  }, 1000);
}

Template.bzLocationNameNewPost.rendered = function () {
  this.data = this.data || {}
  this.data.sessionName = this.data.sessionName || 'bz.posts.new.location2';
  var that = this;
  setTimeout(function () {
    $(document).off('open.fndtn.reveal', '[data-reveal].js-new-post-location');
    $(document).on('open.fndtn.reveal', '[data-reveal].js-new-post-location', function () {
      $('.js-location-modal-holder-new-post').empty();
      searchModalView1 = Blaze.renderWithData(Template.bzChooseLocationModal, {
        sessionName: that.data.sessionName
      }, $('.js-location-modal-holder-new-post')[0]);
      //Session.set('bz.search.searchModalView');
      //var modal = $(this); bzChooseLocationModal
    });
    //$(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
    //});
  }, 1000);
}
Template.bzLocationNameNewPost.helpers({
  getCurrentLocationName: function(){
    debugger;
    var ret = Session.get(this.sessionName);
    return ret && ret.name || 'Location is not defined';
  }
});


Template.bzChooseLocationModal.created = function () {

  this.data = this.data || {}
  this.data.sessionName = this.data.sessionName || 'bz.control.search.location';

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
    setLocationFromData(locName, v.data, this.sessionName);
    if(this.sessionName === 'bz.posts.new.location2') {
      searchModalView1 && Blaze.remove(searchModalView1);
      $('#choose-locations-new-post').foundation('reveal', 'close');
    } else {
      searchModalView && Blaze.remove(searchModalView);
      $('#choose-locations-global').foundation('reveal', 'close');
    }
  },
  'click .js-locations-list a': function (e, v) {
debugger;
    var locName, locId;
    locName = e.target.dataset.locationname;
    if (locName) {
      $('.js-location-name-input.tt-input').val(locName);
    }
    var locId = e.target.dataset.locationid;
    if (locId) {
      v.data.locationId = locId;
    }
    var isCurrentLocation = e.target.dataset.iscurrentlocation;
    if(isCurrentLocation){
      v.data.isCurrentLocation = true;
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
      },
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
      }
    ];
    return ret;
  },
  getCurrentLocationName: function () { //FromSearchControl
    return Session.get(this.sessionName) && Session.get(this.sessionName).name;
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

  }
});