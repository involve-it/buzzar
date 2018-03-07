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

Meteor.startup(function() {
    var user, codes;

    var invCodeAdm = bz.cols.invitationCodes.findOne({ note: 'defaultAdmin' })._id;
    var invCodeTr = bz.cols.invitationCodes.findOne({ note: 'defaultTrainer' })._id;
// create hero users:
    var userExisting = Meteor.users.findOne({'emails.0.address': 'arutune@gmail.com'});
    if (!userExisting) {


        if (userExisting) {
            Meteor.users.remove(userExisting._id);
            bz.cols.invitationCodes.remove({issuerId: userExisting._id});
        }

        var cityLip = bz.cols.cities.findOne({name: 'Lipetsk'});
        Accounts.createUser({
            username: 'a',
            password: 'g1',
            profile: {name: 'Эш', type: bz.const.userTypes.hero, inviteCode: invCodeAdm, city: 'Lipetsk'},
            email: 'arutune@gmail.com'
        });
        var userExisting = Meteor.users.findOne({'emails.0.address': 'xvolkx48@gmail.com'});
        if (userExisting) {
            Meteor.users.remove(userExisting._id);
            bz.cols.invitationCodes.remove({issuerId: userExisting._id});
        }
        var cityLip = bz.cols.cities.findOne({name: 'Lipetsk'});
        Accounts.createUser({
            username: 'x',
            password: 'x1',
            profile: {name: 'Евгений', type: bz.const.userTypes.hero, inviteCode: invCodeAdm, city: 'Lipetsk'},
            email: 'xvolkx48@gmail.com'
        });

// create fake treners:
        var userExisting = Meteor.users.findOne({username: 'john1'});
        if (userExisting) {
            Meteor.users.remove(userExisting._id);
            bz.cols.invitationCodes.remove({issuerId: userExisting._id});
        }
        user = Accounts.createUser({
            username: 'john1',
            password: 'j1',
            profile: {name: 'Василий Пупкин', type: bz.const.userTypes.trainer, inviteCode: invCodeTr, city: 'Lipetsk'},
            email: 'john1@shiners.ru'
        });
        user = Meteor.users.findOne(user);
        codes = bz.bus.invitationCodes.generateUserCodes(user);
        user.profile.myInvitationCodes = codes;

        var userExisting = Meteor.users.findOne({username: 'john2'});
        if (userExisting) {
            Meteor.users.remove(userExisting._id);
            bz.cols.invitationCodes.remove({issuerId: userExisting._id});
        }
        user = Accounts.createUser({
            username: 'john2',
            password: 'j1',
            profile: {
                name: 'Герман Павлович Мейерхольд',
                type: bz.const.userTypes.trainer,
                inviteCode: invCodeTr,
                city: 'Lipetsk'
            },
            email: 'john2@shiners.ru'

        });
        user = Meteor.users.findOne(user);
        codes = bz.bus.invitationCodes.generateUserCodes(user);
        user.profile.myInvitationCodes = codes;

        var userExisting = Meteor.users.findOne({username: 'john3'});
        if (userExisting) {
            Meteor.users.remove(userExisting._id);
            bz.cols.invitationCodes.remove({issuerId: userExisting._id});
        }
        user = Accounts.createUser({
            username: 'john3',
            password: 'j1',
            profile: {
                name: 'Здоб Ши Здуб Печорkин',
                type: bz.const.userTypes.trainer,
                inviteCode: invCodeTr,
                city: 'Lipetsk'
            },
            email: 'john3@shiners.ru'
        });
        user = Meteor.users.findOne(user);
        codes = bz.bus.invitationCodes.generateUserCodes(user);
        user.profile.myInvitationCodes = codes;

        var userExisting = Meteor.users.findOne({username: 'dressup'});
        if (userExisting) {
            Meteor.users.remove(userExisting._id);
            bz.cols.invitationCodes.remove({issuerId: userExisting._id});
        }
        user = Accounts.createUser({
            username: 'dressup',
            password: 'd1',
            profile: {name: 'Ужин в платьях', type: bz.const.userTypes.admin, inviteCode: invCodeAdm, city: 'Voronezh'},
            email: 'shiners.test@gmail.com'
        });
        user = Meteor.users.findOne(user);
        codes = bz.bus.invitationCodes.generateUserCodes(user);
        user.profile.myInvitationCodes = codes;
    }
});

// bz.cols.usersTrainers = new Mongo.Collection('bz.users.trainers');
Meteor.publish('bz.users.trainers', function(){
    // return Meteor.users.find({});
    return Meteor.users.find({
        'profile.type': bz.const.userTypes.trainer
    }, { });
});
