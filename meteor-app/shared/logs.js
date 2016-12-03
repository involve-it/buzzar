/**
 * Created by c_aarutyunyan on 12/3/16.
 */
// collection for logging

bz.cols.logs = new Mongo.Collection('bz.logs');
Meteor.startup(function () {
  if (Meteor.isServer) {
    Meteor.publish('bz.cols.logs', function () {
      var user = Meteor.users.findOne(this.userId);
      if (user && user.profile.isAdmin) {
        return bz.cols.logs.find();
      } else {
        return []
      }
    });
    bz.cols.logs.allow({
      insert: function(userId, doc) {
        var user = Meteor.users.findOne(userId);
        if (user && user.profile.isAdmin) {
          return true;
        } else {
          return false;
        }
      }
    })
  }
  if (Meteor.isClient) {
    var user = Meteor.user();
    if (user && user.profile.isAdmin) {
      Meteor.subscribe('bz.cols.logs');
    }
  }
});

var Log = function (msg, from) { // msg (object, string) - message itself, from (string) is any text indicating where log was called
  bz.cols.logs.insert({
    msg: msg,
    ts: Date.now(),
    from: from,
    user: Meteor.userId()
  });
}
Meteor.methods({
  'bz.logs.log': Log
});
bz.log = Log;
