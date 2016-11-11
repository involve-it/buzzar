/**
 * Created by Ashot on 9/25/15.
 */
window.avatarThumbnailReactive = ReactiveVar();

Meteor.startup(function () {
  avatarThumbnailReactive.set();
  Tracker.autorun(function () {
    var img = avatarThumbnailReactive.get();
    if (!Meteor.userId()) {
      avatarThumbnailReactive.set();
    } else {
      if (img && img !== '') {
        img.save().then(img1=> {
          Meteor.users.update(Meteor.userId(), {
            $set: {
              'profile.image': {
                data: img1.data
              }
            }
          });
        });
      }
    }
  });
});