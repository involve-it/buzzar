/**
 * Created by root on 9/23/15.
 */
Template.bzChooseLocationModal.created = function(){
  Meteor.subscribe('locations-my');
};
Template.bzChooseLocationModal.rendered = function(){
  
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