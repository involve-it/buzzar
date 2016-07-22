/**
 * Created by ashot on 8/21/15.
 */

bz.cols.chats = new Mongo.Collection('bz.chats');
Ground.Collection(bz.cols.chats);
if (Meteor.isServer) {
  //bz.cols.chats.remove({});
}
bz.cols.chats.getNewMessagesAmountForUser = function(userObj){
  var user = userObj || Meteor.user();
}

bz.cols.chats.before.insert(function (userId, doc) {
});

if (Meteor.isServer) {

  //if(bz.config.env === 'dev'){  // todo: this is non-secure!
  bz.cols.chats.allow({
    insert: function () {
      return true;
    },
    remove: function () {
      return true;
    },
    update: function () {
      return true;
    }
  });
  //}
}
if (Meteor.isServer) {
  Meteor.publish('bz.chats.all', function () {
    return bz.cols.chats.find(); // todo: non-sec, testing only
  });
  Meteor.publish('bz.chats.my', function (userId) {
    return bz.cols.chats.find({
      users: {$in: [userId]}
    });
    /*return bz.cols.chats.find({
      $or: [

        {
          userId: userId
        },
        {
          users: {$in: [userId]}
        }
      ]
    });*/
  });
  Meteor.publish('bz.chats.id', function (chatId, userId) {
      return bz.cols.chats.find({_id:chatId, users:userId }); //todo: Не забыть добавить что делать если не соответствует
  });
}


//messages
bz.cols.messages = new Mongo.Collection('bz.messages');
Ground.Collection(bz.cols.messages);
if (Meteor.isServer) {
  //bz.cols.messages.remove({});
}

bz.cols.messages.before.insert(function (userId, doc) {

});
// todo: check situation that ANY user can remove ANY message/chat etc!
if (Meteor.isServer) {
  bz.cols.messages.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    }
  });
}
if (Meteor.isServer) {
  Meteor.publish('bz.messages.users', function (usersArr) {
    return bz.cols.messages.find({userId: {$in: usersArr}, toUserId: {$in: usersArr}});
  });
  Meteor.publish('bz.messages.chatId', function (chatId) {
    return bz.cols.messages.find({chatId: chatId});
  });

  // current user's unseen messages:
  Meteor.publish('bz.messages.unseenToMe', function (userId) {
    return bz.cols.messages.find({toUserId: userId, seen: false});
  });
}