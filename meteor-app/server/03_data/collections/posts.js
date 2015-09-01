/**
 * Created by ashot on 7/26/15.
 */

bz.cols.postTypes = new Mongo.Collection('postTypes');
bz.cols.postTypes.remove({});
bz.cols.postTypes.insert({
  name: 'trade'
});
bz.cols.postTypes.insert({
  name: 'donate'
});
bz.cols.postTypes.insert({
  name: 'jobs'
});
bz.cols.postTypes.insert({
  name: 'housing'
});
bz.cols.postTypes.insert({
  name: 'lost-and-found'
});


bz.cols.nearbyPosts = new Mongo.Collection('nearbyPosts');
