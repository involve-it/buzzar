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
bz.help.makeNamespace('bz.const');
bz.const.adminsList = adminsList;
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
Meteor.publish('users-admin', function () {
  var ret;
  if (Meteor.users.findOne(this.userId) && Meteor.users.findOne(this.userId).isAdmin()){
    ret = Meteor.users.find();
  } else {
    Meteor.users.find({}, {fields: {
      '_id':1,
      'username':1,
      'createdAt':1,
      'profile':1,
      'online':1
    }});
  }
  return ret;
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

// bz.cols.userTypes =  new Meteor.Collection('bz.userTypes');
// bz.cols.userTypes.insert({ value: 'visitor' }); // default user
// bz.cols.userTypes.insert({ value: 'admin' });
// bz.cols.userTypes.insert({ value: 'trainer' });



bz.const.userTypes = { visitor: 'visitor', admin: 'admin', trainer: 'trainer', hero: 'hero' };

// create hero users:
Meteor.users.remove({ 'emails.0.address': 'arutune@gmail.com' }); Accounts.createUser({username: 'a', password: 'g1', email: 'arutune@gmail.com', profile: { name: 'Эш', type: bz.const.userTypes.hero }});

// create fake treners:
Meteor.users.remove({ username: 'john1' }); Accounts.createUser({username: 'john1', password: 'j1', profile: { name: 'Василий Пупкин', type: bz.const.userTypes.trainer }});
Meteor.users.remove({ username: 'john2' }); Accounts.createUser({username: 'john2', password: 'j1', profile: { name: 'Герман Павлович Мейерхольд', type: bz.const.userTypes.trainer }});
Meteor.users.remove({ username: 'john3' }); Accounts.createUser({username: 'john3', password: 'j1', profile: { name: 'Здоб Ши Здуб Печорkин', type: bz.const.userTypes.trainer }});
Meteor.users.remove({ username: 'dressup' }); Accounts.createUser({username: 'dressup', password: 'd1', profile: { name: 'Ужин в платьях', type: bz.const.userTypes.admin }, email: 'shiners.test@gmail.com' });

// bz.cols.usersTrainers = new Mongo.Collection('bz.users.trainers');
Meteor.publish('bz.users.trainers', function(){
    // return Meteor.users.find({});
    return Meteor.users.find({
        'profile.type': bz.const.userTypes.trainer
    }, { });
});
