/*Find contacts*/
Meteor.publish('users', function () {
  return Meteor.users.find();
});
Meteor.publish('posts-all', function () {
  return bz.cols.posts.find();
});
Meteor.publish('posts-my', function () {
  return bz.cols.posts.find({
    userId: this.userId
  });
});


