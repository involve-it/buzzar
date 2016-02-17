/*Find contacts*/
Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: {
    '_id':1,
    'username':1,
    'createdAt':1,
    'profile':1,
    'online':1
  }});
});


Meteor.publish('users-one', function (userIds) {
  if (!Array.isArray(userIds)){
    userIds = [userIds];
  }

  return Meteor.users.find({'_id': {$in: userIds}}, {fields: {
    '_id':1,
    'username':1,
    'createdAt':1,
    'profile':1,
    'online':1
  }});
});

Meteor.publish('posts-all', function () {
  return bz.cols.posts.find({}, {
    fields: {
      'status.visible': {$exists: true}
    }
  });
});
Meteor.publish('posts-my', function () {
  return bz.cols.posts.find({
    userId: this.userId
  });
});

Meteor.publish('posts-images', function () {
    return bz.cols.images.find();
});
