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

// ---- POST DETAILS PAGE (used for website post details page):
Meteor.publish('postByIds', function(postId) {
  console.log('postByIds: ' + bz.cols.posts.find({_id: postId}).count());

  return bz.cols.posts.find({_id: postId});
})
Meteor.publish('profileDetailsByPostId', function(postId) {
  var posts = bz.cols.posts.find({_id: postId}).fetch();

  var usersIds = _.map(posts, function (post) {
    return post.userId
  });
  console.log('profileDetailsByPostId: ' + bz.cols.profileDetails.find({userId: {$in: usersIds}}).count());

  return bz.cols.profileDetails.find({userId: {$in: usersIds}});
});
Meteor.publish('postPhotosByPostId', function(postId) {
  var posts = bz.cols.posts.find({_id: postId}).fetch();
  var photosId = _.map(posts, function (post) {
    return post.details.photos
  }).reduce(function (a, b) {
    return a.concat(b);
  }).filter(function(p) { return p !== undefined; });
  console.log('postPhotosByPostId: ' + bz.cols.images.find({_id: {$in: photosId}}).count());

  return bz.cols.images.find({_id: {$in: photosId}});
});
Meteor.publish('postUsersByPostId', function(postId) {
  var posts = bz.cols.posts.find({_id: postId}).fetch();
  var usersIds = _.map(posts, function (post) {
    return post.userId
  });
  console.log('postUsersByPostId: ' + Meteor.users.find({_id:{$in: usersIds}}).count());

  return Meteor.users.find({_id:{$in: usersIds}})
});
// ---- END POST DETAILS


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
  request = request || {};
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
    //to return 0 results:
    postsQuery = { _id: 'this id is not possible, meaning of this is to return 0 results'};
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