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

Meteor.publish('posts-all', function () {
  var now = new Date().getTime();
  return bz.cols.posts.find({
    'status.visible': {$ne: null},
    endDatePost: {$gte: now}
  }, {
    fields: {'details.locations.coords':0}
  });
});
Meteor.publish('posts-my', function () {
  return bz.cols.posts.find({
    userId: this.userId
  });
});

//new code publication
Meteor.publish('posts-nearby',function(request){
  var ret, lat,lng,radius, postsQuery={},posts,arrTypes=[], activeCats, box;
  lat=request.lat;
  lng=request.lng;
  radius=request.radius;
  activeCats=request.activeCats;
  if (lat && lng && radius) {
    box = bz.bus.proximityHandler.getLatLngBox(lat, lng, radius);
    if (box) {
      postsQuery['details.locations'] = {
        $elemMatch: {
          'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
          'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
        }
      };
    }
  }else{

  }
  if (activeCats && Array.isArray(activeCats) && activeCats.length > 0) {
    postsQuery['type'] = {$in: activeCats};
  } else {
    arrTypes = _.map(bz.cols.postAdTypes.find().fetch(), function (item) {
      return item.name;
    });
    arrTypes.push(undefined);
    arrTypes.push('');
    postsQuery['type'] = {$in: arrTypes};
  }
  postsQuery['status'] ={visible: bz.const.posts.status.visibility.VISIBLE};
  posts= bz.cols.posts.find(postsQuery);
  ret=posts;
  return ret;
});