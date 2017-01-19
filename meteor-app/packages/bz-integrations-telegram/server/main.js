import { HTTP } from 'meteor/http';

Meteor.startup(function () {
  bz.cols.posts.after.insert(function(userId, doc) {
    AddNewPost(doc);
  })
  Meteor.users.after.insert(function(userId, doc) {
    AddedNewUser(doc);
  })
});

GetNearbyPosts = function(loc = {}) {
  var request = {
    lat: loc.latitude,
    lng: loc.longitude,
    radius: 1
  }, ret = 'No posts found.. maybe try different location?';

  var res = Meteor.call('getNearbyPostsTest', request);
  if (res && res.result && res.result.length) {
    ret = 'Closest posts found: \n' + res.result.map(i => { return i.details.title + ': '
        + i.details.description + '( /details_' + i._id + ' )' }).join('\n');
  }
  return ret;
}

