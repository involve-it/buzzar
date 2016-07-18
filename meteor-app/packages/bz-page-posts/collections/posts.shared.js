/**
 * Created by yvdorofeev on 10/20/15.
 */

// use original helpers package to and override transform function
// (see https://github.com/dburles/meteor-collection-helpers/blob/master/collection-helpers.js)
Mongo.Collection.prototype.elpers = function(helpers) {
  var self = this;

  if (self._transform && ! self._helpers)
    throw new Meteor.Error("Can't apply helpers to '" +
        self._name + "' a transform function already exists!");

  if (! self._helpers) {
    self._helpers = function Document(doc) { return _.extend(this, doc); };
    self._transform = function(doc) {
      doc = helpers._bzTransform(doc);
      return new self._helpers(doc);
    };
  }

  _.each(helpers, function(helper, key) {
    self._helpers.prototype[key] = helper;
  });
};

bz.cols.posts = new Mongo.Collection('posts');
Ground.Collection(bz.cols.posts);
var postsColl = bz.cols.posts;
bz.cols.posts.bzHelpers = {
  _hasLivePresence: bz.help.posts.hasLivePresence,
  _getDistanceToCurrentLocation: bz.help.posts.getDistanceToCurrentLocation,
  _getDistanceToCurrentLocationNumber: bz.help.posts.getDistanceToCurrentLocationNumber,
  //_getLikesAmount: bz.help.posts.getLikesAmount,
  _getDistanceQualifier: bz.help.posts.getDistanceQualifier,
  _getImagesObjects: bz.help.posts.getImagesObjects,
  _bzTransform: function(doc) {
    if (Meteor.isServer && bz.bus.postsHandler.buildPostObject) {
      doc = bz.bus.postsHandler.buildPostObject(doc);
    }
    return doc;
  }
}



postsColl.elpers(bz.cols.posts.bzHelpers);
