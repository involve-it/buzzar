/**
 * Created by Ashot on 9/27/15.
 */
Meteor.publish('bz.users.all', function(){
  return Meteor.users.find();
})
Meteor.publish('bz.users.all', function(){
  return Meteor.users.find();
})
Meteor.publish('bz.users.byId', function(userId){
  return Meteor.users.findOne( userId )
})