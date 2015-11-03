/*Find contacts*/
Meteor.publish('users', function () {
  return Meteor.users.find();
});

Meteor.publish('users-one', function (userIds) {
  if (!Array.isArray(userIds)){
    userIds = [userIds];
  }

  return Meteor.users.find({'_id': {$in: userIds}});
});

Meteor.publish('posts-all', function () {
  return bz.cols.posts.find();
});
Meteor.publish('posts-my', function () {
  return bz.cols.posts.find({
    userId: this.userId
  });
});

Meteor.publish('posts-images', function () {
    return bz.cols.images.find();
});
