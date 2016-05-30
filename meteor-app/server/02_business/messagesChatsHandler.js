/**
 * Created by xvolkx48 on 20.05.2016.
 */
bz.bus.messagesChatsHandler = {
  getChat: function(chatId){
    var ret, currentUser, chat, chatRet;
    currentUser=Meteor.userId();
    if(currentUser){
      chat=bz.cols.chats.findOne(chatId);
      if(chat){
        if(chat.users.indexOf(currentUser)!==-1) {
          chatRet = bz.bus.messagesChatsHandler.buildChatsObject([chat], currentUser);
          if (chatRet.success) {
            ret = {success: true, result: chatRet.result[0]};
          } else {
            //error
            ret = {success: false, result: chatRet.error};
          }
        }else{
          //error
          ret={success:false, error: bz.const.errors.messagesChats.userNotMemberThisChat};
        }
      }else{
        //error
        ret={success:false, error: bz.const.errors.global.dataNotFound};
      }
    }else{
      //error not logged
      ret={success: false, error: bz.const.errors.global.notLogged}
    }
    return ret;
  },
  getChats: function(request){
    var ret, skip,take,chats,arrChats,option, currentUser;
    skip=request.skip;
    take=request.take;
    currentUser=Meteor.userId();
    option={sort:{lastMessageTs:-1},skip: skip, limit: take};
    if (currentUser){
      arrChats=bz.cols.chats.find({users: currentUser},option).fetch();
      if (arrChats && arrChats.length) {
        chats = bz.bus.messagesChatsHandler.buildChatsObject(arrChats, currentUser);
        if (chats.success) {
          ret = {success: true, result: chats.result};
        } else {
          //error
          ret = {success: false, error: chats.error};
        }
      }else{
        ret = {success: true, result:[]};
      }
    }else{
      //error not logged
      ret={success: false, error: bz.const.errors.global.notLogged}
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
      if (arrUsers && arrUsers.length>0) {
        users = _.filter(arrUsers, function (item) {
          return item !== currentUserId
        });
        arrUsers = bz.bus.usersHandler.userDbQuery(users);
        users = bz.bus.usersHandler.buildUserObject(arrUsers);
        lastMessages = bz.cols.messages.find({chatId: {$in: chatsId}, timestamp: {$in: lastMessageTs}}).fetch();
        if (lastMessages && lastMessages.length===chats.length) {
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
          ret = {success: true, result: chatsRet};
        }else{
          //error
          ret={success:false, error: bz.const.errors.messagesChats.lastMessageCountNotEqualChatsCount}
        }
      }else{
        //error
        ret={success: false, error: bz.const.errors.messagesChats.noOtherUsers};
      }
    }else{
      ret={success:true, result:[]}
    }
    return ret;
  }
};