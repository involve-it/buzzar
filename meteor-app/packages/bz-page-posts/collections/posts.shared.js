/**
 * Created by yvdorofeev on 10/20/15.
 */
bz.cols.posts = new Mongo.Collection('posts');

var postsColl = bz.cols.posts;

postsColl.helpers({
  _hasLivePresence: bz.help.posts.hasLivePresence,
  _distance: bz.help.posts.distance
});

