/**
 * Created by c_aarutyunyan on 12/2/16.
 */
bz.cols.telegramChats = new Mongo.Collection('telegramChats');
if (Meteor.isServer) {
  Meteor.publish('telegramChats', function(){
    return bz.cols.telegramChats.find();
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('telegramChats'); // for testing
}
