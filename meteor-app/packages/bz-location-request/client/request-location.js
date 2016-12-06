/**
 * Created by c_aarutyunyan on 12/5/16.
 */

bz.bus.requestLocation = function() {
  /*var userId = bz.help.getParamURL().requesterUserId;
  if (userId) {
    debugger;

  } else {
    throw 'userId was not defined'
  }*/
  var to = $('.js-request-location-address').val();
  if (to) {
    var trackId = _.guid();
    Tracker.autorun(function() {
      bz.cols.locationTrackings.find({ trackId: trackId });
      if (bz.cols.locationTrackings.find({ trackId: trackId }).fetch().length) {
        console.log('bz.bus.requestLocation, trackId=' + trackId);
        Router.go(`viewLocation`, {}, { query: { trackId: trackId }});
      }
    })

    Meteor.call('bz.sendNotificationLink', to, trackId, function (e, r) {
      bz.ui.alert('Notification link was sent, your trackId: ' + trackId);
    });
  }
  /*setInterval(function() {

    navigator.geolocation.getCurrentPosition(function(pos) {
      Meteor.call('bz.sendTrackedLocation', pos, function(e, r) {
        debugger;
      });
    }, function(err) {
    }, options);
  }, 3000);*/

}