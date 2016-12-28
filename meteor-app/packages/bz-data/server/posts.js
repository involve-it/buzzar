/**
 * Created by c_aarutyunyan on 12/27/16.
 */

Meteor.publish('posts-all', function () {
  var ret;
  var now = new Date().getTime();
  ret = bz.cols.posts.find({
    'status.visible': {$ne: null},
    endDatePost: {$gte: now}
  }, {
    fields: {'details.locations.coords':0}
  })
  return ret;
});
Meteor.publish('posts-my', function () {
  return bz.cols.posts.find({
    userId: this.userId
  });
});

//new code publication

Meteor.publish('posts-nearby-events', function(request){
  if (request && request.lat && request.lng && request.radius){
    var box = bz.bus.proximityHandler.getLatLngBox(request.lat, request.lng, request.radius);
    if (box){
      return bz.cols.posts.find({
        'details.locations': {
          $elemMatch: {
            'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
            'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
          }
        },
        'status': {visible: bz.const.posts.status.visibility.VISIBLE},
        'endDatePost': { $gte : Date.now() }
      });
    }
  }
  return null;
});

// NOT USED NOW..
Meteor.publish('posts-nearby',function(request){
  request = request || {};
  var self = this;
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
  // get only non-expired posts (if no value provided in call):
  if (!postsQuery['endDatePost']) {
    postsQuery['endDatePost'] = { $gte : Date.now() }
  }
  // tis doesn't work yet, try this( http://stackoverflow.com/questions/20895154/how-to-transform-data-returned-via-a-meteor-publish/20896561#20896561)
  posts= bz.cols.posts.find(postsQuery).forEach(function(entry) {
    self.hasLivePresence = true;
    self.added('posts-nearby', entry._id, entry);
  });
  self.ready();
  ret = posts;
  return ret;
});
bz.cols.posts.allow({
  insert: function () {
    return Meteor.user() && Meteor.user().isAdmin();
  },
  update: function (___, post) {
    return Meteor.user() && (Meteor.user().isAdmin());// || Meteor.user().postBelongsToUser(post));
  },
  remove: function (___, post) {
    return Meteor.user() && (Meteor.user().isAdmin());// || Meteor.user().postBelongsToUser(post));
  }
});
