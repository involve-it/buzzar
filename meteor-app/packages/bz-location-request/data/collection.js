/**
 * Created by c_aarutyunyan on 12/2/16.
 */
bz.cols.locationTrackings = new Mongo.Collection('locationTrackings');
if (Meteor.isServer) {
  Meteor.publish('locationTrackings', function(){
    return bz.cols.locationTrackings.find();
  });
  Meteor.startup(function () {
    bz.cols.locationTrackings.allow({
      insert: function() {
        return true;
      },
      update: function() {
        return true;
      }
    })
    bz.cols.locationTrackings.after.insert(function(userId, doc) {

    });
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('locationTrackings'); // for testing
}

