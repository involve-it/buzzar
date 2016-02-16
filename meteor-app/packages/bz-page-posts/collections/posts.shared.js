/**
 * Created by yvdorofeev on 10/20/15.
 */
bz.cols.posts = new Mongo.Collection('posts');

var postsColl = bz.cols.posts;

postsColl.helpers({
  _hasLivePresence: bz.help.posts.hasLivePresence,
  _getDistanceToCurrentLocation: bz.help.posts.getDistanceToCurrentLocation,
  _getDistanceToCurrentLocationNumber: bz.help.posts.getDistanceToCurrentLocationNumber,
  _getLikesAmount: bz.help.posts.getLikesAmount,
  _getDistanceQualifier: bz.help.posts.getDistanceQualifier,
  _getImagesObjects: bz.help.posts.getImagesObjects
});

