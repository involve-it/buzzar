/**
 * Created by c_aarutyunyan on 12/5/16.
 */
Template.shareLocation.onRendered(function() {

  Meteor.call('bz.generateMessageForSharingLocation', bz.help.getParamURL().requesterUserId, function(e, r) {
    $('.js-message-holder').html(r)
  })
})

Template.shareLocation.events({
  'click .js-share-location-btn': function() {
    bz.bus.shareLocation();
  }
})
Template.shareLocation.helpers({

})

bz.bus.shareLocation = function() {
  /*var userId = bz.help.getParamURL().requesterUserId;
  if (userId) {
    debugger;

  } else {
    throw 'userId was not defined'
  }*/

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  navigator.geolocation.getCurrentPosition(function(pos) {
    Meteor.call('bz.initTrackedLocation', { lat: pos.coords.latitude, lng: pos.coords.longitude }, bz.help.getParamURL().trackId, function(e, r) {
      bz.ui.alert('Shared location, close window anytime to stop sharing!');
    });
  }, function(err) {
  }, options);
  /*setInterval(function() {

    navigator.geolocation.getCurrentPosition(function(pos) {
      Meteor.call('bz.sendTrackedLocation', pos, function(e, r) {
        debugger;
      });
    }, function(err) {
    }, options);
  }, 3000);*/

}