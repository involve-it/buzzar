/**
 * Created by Ashot on 9/27/15.
 */
Meteor.publish('bz.users.all', function(){
  return Meteor.users.find({}, {fields: {
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