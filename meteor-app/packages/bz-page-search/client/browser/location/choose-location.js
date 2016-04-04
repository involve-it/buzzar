/**
 * Created by root on 9/23/15.
 */
Template.bzLinkLocationName.helpers({
  notDefinedLocationClass: function(){
    var ret = Session.get('bz.control.search.location');
    return ret && ret.name ? '' : 'bz-fa-location-not-defined';
  },
  getCurrentLocationName: function(){
    var ret = Session.get('bz.control.search.location');

    if(ret && ret.accurateAddress || ret && ret.name) {
       
      if(ret.accurateAddress) {
        return ret.accurateAddress;
      } else {
        return ret.name;
      }
    } else {
      //bz.ui.error('Your location is not defined, <br/> please <a onclick="$(\'.bz-link-lacation-name\').click()">set your location manually.</a>')
      return 'Location is not defined';
    }
  }
});

Template.bzLocationName.rendered = function () {
  var that = this;
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
  }, 0);
};

Template.bzLocationNameNewPost.rendered = function () {
  this.data = this.data || {};
  this.modalSelector = '[data-reveal].js-new-post-location';
  this.data.sessionName = this.data.sessionName || location2.sessionName;
  var that = this;
  setTimeout(function () {
    $(document).off('open.fndtn.reveal', '[data-reveal].js-new-post-location');
    $(document).on('open.fndtn.reveal', '[data-reveal].js-new-post-location', function () {
      $('.js-location-modal-holder-new-post').empty();
      searchModalView2 = Blaze.renderWithData(Template.bzChooseLocationModal, {
        sessionName: that.data.sessionName
      }, $('.js-location-modal-holder-new-post')[0]);
      //Session.set('bz.search.searchModalView');
      //var modal = $(this); bzChooseLocationModal
    });
    //$(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
    //});
  }, 0);
};

// custom helper to show the modal:
Template.bzLocationNameNewPost.showModal = function(){
  $('[data-reveal].js-new-post-location').foundation('reveal', 'open');
}
Template.bzLocationNameNewPost.helpers({
  getCurrentLocationName: function(){
    var ret = Session.get(this.sessionName)// && Session.get(this.sessionName).dbObject;
    return ret && ret.name;
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
  'click .close-modal': function () {
    $('#choose-locations-global').foundation('reveal', 'close');
  },
  'click .js-set-location-button': function (e, v) {
    //var that = this;
    //Tracker.nonreactive(function () {
    // todo: submit view for validation.
    // validateAbideView(v);

    var locName = $('.js-location-name-input.tt-input').val() || $('.js-location-name-input').val();
    
    if(!locName){

    } else {
      setLocationToSessionFromData(locName, v.data, this.sessionName);
      if (this.sessionName === 'bz.control.search.location') {
        searchModalView && Blaze.remove(searchModalView);
        $('.js-global-location').foundation('reveal', 'close');
      } else {
        searchModalView2 && Blaze.remove(searchModalView2);
        $('.js-new-post-location').foundation('reveal', 'close');
      }
    }
    return false;
  },
  'click .js-locations-list a': function (e, v) {
    var locName, locId;
    locName = e.currentTarget.dataset.locationname;
    if (locName) {
      $('.js-location-name-input').val(locName);
    }
    var locId = e.currentTarget.dataset.locationid;
    if (locId) {
      v.data.locationId = locId;
    }
    var isCurrentLocation = e.currentTarget.dataset.iscurrentlocation;
    if(isCurrentLocation){
      v.data.isCurrentLocation = true;
    }
    $('.js-set-location-button').click();
    return false;
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
        header: '<h3 class="league-name">Popular Places</h3>',
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
      /*{
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
      }*/
    ];
    return ret;
  },
  /*getCurrentLocationName: function () { //FromSearchControl
    return Session.get(this.sessionName) &&  Session.get(this.sessionName).dbObject && Session.get(this.sessionName).dbObject.name;
  },*/
  getUserLocations: function () {
    var ret;
    if (Meteor.userId()) {

      ret = bz.cols.locations.find({
        userId: Meteor.userId(),
        name: {$ne: '>MY_LOCATION_TEXT<'}
      });
    }
    return ret;
  },
  accurateAddress: function() {
    var ret =  Session.get('getAccurateAddress');
    return ret && ret.name;
  },
  getPopularPlacesAround: function () {}
});