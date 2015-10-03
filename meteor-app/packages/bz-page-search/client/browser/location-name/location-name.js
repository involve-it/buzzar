/**
 * Created by root on 9/23/15.
 */


debugger;

Template.bzChooseLocationModal.created = function(){
  debugger;
};
Template.bzChooseLocationModal.rendered = function(){
  debugger;
};
Template.bzChooseLocationModal.events({
  'click .js-set-location-button': function(){
    debugger;
  },
  'click .js-locations-list a': function(e, v){
    debugger;
    var locName = e.target.dataset.location;
  }
});

Template.bzChooseLocationModal.helpers({
  getLocationName: function(){ //FromSearchControl
    return Session.get('bz.control.search.location') && Session.get('bz.control.search.location').name;
  }
});