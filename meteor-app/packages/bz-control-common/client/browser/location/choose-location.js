/**
 * Created by root on 9/23/15.
 */
Template.bzLocationName.rendered = function(){
  setInterval(function(){
    $(document).off('open.fndtn.reveal', '[data-reveal]');
    $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
      $('.js-location-modal-holder').empty();
      Blaze.renderWithData(Template.bzChooseLocationModal, {}, $('.js-location-modal-holder')[0]);
      //var modal = $(this); bzChooseLocationModal
    });
    //$(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
    //  debugger;
    //});
  }, 1000);
}
Template.bzChooseLocationModal.created = function(){
  Meteor.subscribe('locations-my');
};
Template.bzChooseLocationModal.rendered = function(){
  Meteor.typeahead.inject();
};
Template.bzChooseLocationModal.events({
  'click .js-set-location-button': function(){
    var res, locName = $('.js-location-name-input').val();
    res = saveLocationByName(locName);
    // do something with the result:
  },
  'click .js-locations-list a': function(e, v){
    
    var locName = e.target.dataset.locationname;
    if(locName){
      $('.js-location-name-input').val(locName);
    }
  }
});

Template.bzChooseLocationModal.helpers({
  placesArray: function () {
    return bz.runtime.maps.places.find().fetch().map(function (object) {
      return {id: object._id, value: object.name};
    });
  },
  getCurrentLocationName: function(){ //FromSearchControl
    return Session.get('bz.control.search.location') && Session.get('bz.control.search.location').name;
  },
  getUserLocations: function(){
    var ret;
    if(Meteor.userId()){

      ret = bz.cols.locations.find({
        userId: Meteor.userId()
      });
    }
    return ret;
  },
  getPopularPlacesAround: function(){

  }
});