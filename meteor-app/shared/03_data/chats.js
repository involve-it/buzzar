/**
 * Created by ashot on 8/21/15.
 */

bz.cols.chats = new Mongo.Collection('bz.chats');
if(Meteor.isServer){
  //bz.cols.chats.remove({});
}

bz.cols.chats.before.insert(function (userId, doc) {
});

//bz.cols.imagesData.remove({});
if (Meteor.isServer) {
  //if(bz.config.env === 'dev'){  // todo: this is non-secure!
    bz.cols.chats.allow({
      insert: function () {
        return true;
      },
      remove: function(){
        return true;
      }
    });
  //}
}
if(Meteor.isServer){
  Meteor.publish('bz.chats.all', function(){
    return bz.cols.chats.find(); // todo: non-sec, testing only
  });
  Meteor.publish('bz.chats.my', function(userId){
    return bz.cols.chats.find({
      userId: userId
    });
  });
  Meteor.publish('bz.chats.id', function(chatId){
    return bz.cols.chats.find(chatId);
  });
}


//messages
bz.cols.messages = new Mongo.Collection('bz.messages');
if(Meteor.isServer){
  //bz.cols.messages.remove({});
}

bz.cols.messages.before.insert(function (userId, doc) {

});
if (Meteor.isServer) {
    bz.cols.messages.allow({
      insert: function () {
        return true;
      },
      remove: function(){
        return true;
      }
    });
}
if(Meteor.isServer){
  Meteor.publish('bz.messages.users', function(usersArr){
    return bz.cols.messages.find({userId: {$in: usersArr}, toUserId: {$in: usersArr}});
  });
  Meteor.publish('bz.messages.chatId', function(chatId){
    return bz.cols.messages.find({chatId: chatId});
  });
}