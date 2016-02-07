/**
 * Created by Ashot on 9/25/15.
 */
window.avatarThumbnailReactive = ReactiveVar();

Meteor.startup(function () {
  avatarThumbnailReactive.set([]);
  Tracker.autorun(function () {
    //var img = Session.get('bz.user.profileImgUploaded');
    var img = avatarThumbnailReactive.get() && avatarThumbnailReactive.get()[0];
    console.log(img);
    if (img && img !== '') {
      Meteor.users.update(Meteor.userId(), { $set: {'profile.image': {
        data: img.data
      } }});
    }
  });
});