/**
 * Created by Ashot on 9/27/15.
 */
const adminsList = [
    'arutune@gmail.com',
    'yvdorofeev@gmail.com',
    'infpartner@gmail.com',
    'tatiana@napodiume.ru',
    'iyirischa@yandex.ru',
    'narine.badalian@gmail.com'
]
Meteor.startup(function() {
  var user;
  adminsList.forEach(function(u) {
    user = Meteor.users.findOne({ 'emails.0.address': u});
    user && Meteor.users.update({'_id': user._id}, {
      $set: { 'profile.isAdmin': true }
    });
  });

  // mark bots:
  Meteor.users.update({ 'emails.0.address': { $regex : '.+\@shiners.ru' }}, {
    $set: {'profile.isBot': true}
  });
})
Meteor.publish('bz.users.all', function(){
  return Meteor.users.find({}, {fields: {
    '_id':1,
    'username':1,
    'createdAt':1,
    'profile':1,
    'online':1
  }});
});
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

/*Meteor.publish('bz.users.byId', function(userId){
  return Meteor.users.findOne(userId);
})*/