/**
 * Created by xvolkx48 on 20.05.2016.
 */
bz.bus.messagesChatsHandler = {
  getChat: function(){

  },
  getChats: function(request){
    var ret, skip,take,chats,arrChats,option, currentUser;
    skip=request.skip;
    take=request.take;
    currentUser=Meteor.userId();
    option={sort:{lastMessageTs:-1},skip: skip, limit: take};
    if (currentUser){
      arrChats=bz.cols.chats.find({users: currentUser},option).fetch();
      chats=bz.bus.messagesChatsHandler.buildChatsObject(arrChats, currentUser);
      ret={success: true, result: chats};
    }else{
      //error not logged
    }
    return ret;
  },
  buildChatsObject: function(chats, currentUserId){
    var ret=[],lastMessages, chatsRet=[],users, chat,chatsId, arrUsers, lastMessageTs;
    if (chats.length>0) {
      chatsId = _.map(chats, function (item) {
        return item._id
      });
      lastMessageTs = _.map(chats, function (item) {
        return item.lastMessageTs
      });
      arrUsers = _.map(chats, function (item) {
        return item.users
      }).reduce(function (a, b) {
        return a.concat(b)
      });
      users = _.filter(arrUsers, function (item) {
        return item !== currentUserId
      });
      arrUsers = bz.bus.usersHandler.userDbQuery(users);
      users = bz.bus.usersHandler.buildUserObject(arrUsers);
      lastMessages = bz.cols.messages.find({chatId: {$in: chatsId}, timestamp: {$in: lastMessageTs}}).fetch();
      _.each(chats, function (item) {
        chat = {
          _id: item._id,
          userId: item.userId,
          users: item.users,
          lastMessageTs: item.lastMessageTs,
          activated: item.activated,
          timeBegin: item.timeBegin
        };
        chat.otherParty = _.filter(users, function (user) {
          return item.users.indexOf(user._id) !== -1;
        });
        chat.lastMessage = _.map(_.filter(lastMessages, function (i) {
          return i.chatId === item._id && i.timestamp === item.lastMessageTs
        }), function (message) {
          return {text: message.text};
        })[0];
        chatsRet.push(chat);
      });
      ret = chatsRet;
    }
    return ret;
  }
};