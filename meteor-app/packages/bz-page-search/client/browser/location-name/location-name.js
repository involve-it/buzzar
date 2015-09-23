/**
 * Created by root on 9/23/15.
 */



Template.bzLocationName.helpers({
  getLocationName: function(){ //FromSearchControl
    return Session.get('bz.control.search.location') && Session.get('bz.control.search.location').name;
  }
});