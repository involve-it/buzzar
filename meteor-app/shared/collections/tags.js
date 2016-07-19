/**
 * Created by xvolkx48 on 06.04.2016.
 */
bz.cols.tags = new Mongo.Collection('tags');
typeof Ground !== 'undefined' && Ground.Collection(bz.cols.tags);
if (Meteor.isServer) {
  Meteor.publish('tags', function () {
    return bz.cols.tags.find();
  });
}
