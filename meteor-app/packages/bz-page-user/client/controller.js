/**
 * Created by Ashot on 9/25/15.
 */
Meteor.startup(function () {
  Tracker.autorun(function () {
    var img = Session.get('bz.user.profileImgUploaded');
    if (img && img !== '') {
      Meteor.users.update(Meteor.userId(), { $set: {'profile.image': img }});
    }
  });
});