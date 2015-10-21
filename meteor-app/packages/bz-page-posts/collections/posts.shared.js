/**
 * Created by yvdorofeev on 10/20/15.
 */
bz.cols.posts = new Mongo.Collection('posts');

var postsColl = bz.cols.posts;

postsColl.helpers({
  _hasLivePresence: function () {
    var loc = null;
    if (this.presences && Object.keys(this.presences).length > 0) {
      _.each(this.presences, function (e, i) {
        if (i !== bz.const.locations.type.DYNAMIC && !loc) {
          loc = _.find(this.details.locations, function (location) {
            return location._id === i;
          });
        }
        if (i === bz.const.locations.type.DYNAMIC) {
          loc = _.find(this.details.locations, function (location) {
            return location.placeType === bz.const.locations.type.DYNAMIC;
          });
        }
      }, this);
    }
    return loc;
  }
});

