/**
 * Created by Ashot on 9/27/15.
 */
Meteor.publish('bz.users.all', function(){
  return Meteor.users.find();
})