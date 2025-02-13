/**
 * Created by xvolkx48 on 20.05.2016.
 */
bz.bus.messagesChatsHandler = {
  getChat: function(chatId){
    var ret, currentUser, chat, chatRet;
    check(chatId, String);
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
      ret={success: false, error: bz.const.errors.global.notLogged};
    }
    return ret;
  },
  getChats: function(request, userId){
    var ret, skip,take,chats,arrChats,option, currentUser;
    check(request,{
      take: Match.Maybe(Number),
      skip: Match.Maybe(Number)
    });
    skip=request.skip;
    take=request.take;
    if (take){
      take++;
    }
    currentUser=userId;
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
      ret={success: false, error: bz.const.errors.global.notLogged};
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
        users = bz.bus.usersHandler.buildUserObject(arrUsers, currentUserId);
        //lastMessages = bz.cols.messages.find({chatId: {$in: chatsId}, timestamp: {$in: lastMessageTs}}).fetch();
        lastMessages = bz.cols.messages.aggregate([{$sort: {timestamp: -1}}, {$group : {_id: '$chatId', message: {$first: '$$ROOT'}}}]);
       // if (lastMessages && lastMessages.length===chats.length) {
          _.each(chats, function (item) {
            chat = {
              _id: item._id,
              userId: item.userId,
              users: item.users,
              //lastMessageTs: item.lastMessageTs,
              activated: item.activated,
              timeBegin: item.timeBegin
            };
            chat.otherParty = _.filter(users, function (user) {
              return item.users.indexOf(user._id) !== -1;
            });
            chat.lastMessage = _.map(_.filter(lastMessages, function (i) {
              return i._id === item._id
            }), function (msgObj) {
              chat.lastMessageTs = msgObj.message.timestamp;
              return {text: msgObj.message.text, seen: msgObj.message.seen, toUserId: msgObj.message.toUserId};
            })[0];
            chatsRet.push(chat);
          });
          ret = {success: true, result: chatsRet};
        /*}else{
          //error
          ret={success:false, error: bz.const.errors.messagesChats.lastMessageCountNotEqualChatsCount};
        }*/
      }else{
        //error
        ret={success: false, error: bz.const.errors.messagesChats.noOtherUsers};
      }
    }else{
      ret={success:true, result:[]};
    }
    return ret;
  },
  getMessages: function(request){
    var messages,arrMessages,ret, take,skip,chatId,chat, currentUser, option;
    check(request,{
      chatId: String,
      take: Match.Maybe(Number),
      skip: Match.Maybe(Number)
    });
    skip=request.skip;
    take=request.take;
    if (take){
      take++;
    }
    chatId=request.chatId;
    currentUser=Meteor.userId();
    chat=bz.cols.chats.findOne({_id: chatId});
    option={sort:{timestamp:-1},skip: skip, limit: take};
    if (currentUser){
      if(chat){
        if(chat.users.indexOf(currentUser)!==-1){
          arrMessages=bz.cols.messages.find({chatId:chatId},option).fetch();
          messages=_.map(arrMessages, function(message){
            var ret;
            ret={
              _id: message._id,
              chatId: message.chatId,
              userId: message.userId,
              toUserId: message.toUserId,
              text: message.text,
              timestamp: message.timestamp,
              keyMessage: message.keyMessage,
              seen: message.seen
            };
            return ret;
          });
          ret={success: true, result: messages};
        }else{
          //error
          ret={success:false, error: bz.const.errors.messagesChats.userNotMemberThisChat};
        }
      }else{
        // error chat not found
        ret={success:false, error: bz.const.errors.global.dataNotFound};
      }
    }else{
      //error not logged
      ret={success: false, error: bz.const.errors.global.notLogged};
    }
    return ret;
  },
  addMessage: function(request){
    var ret,chat, chatId, currentUser, toUser, message,messageId,keyMessage,text, toUserId, type, validate, now;
    /*check(request,{
      message: String,
      //type: Match.Maybe(String),
      destinationUserId: String,
      associatedPostId: Match.Maybe(String)
    });*/

    now=Date.now();
    text=request.message;
    type=request.type;
    keyMessage="own-message";
    currentUser=Meteor.userId();
    toUserId=request.destinationUserId;
    toUser=Meteor.users.findOne({_id: toUserId});
    if(currentUser){
      if(toUser){
        validate=bz.bus.messagesChatsHandler.validate(text);
        if(validate.success){
          chat=bz.cols.chats.findOne({users:{$all:[currentUser,toUserId]}});
          if(chat) {
            chatId=chat._id;
          }else{
            chat={
              userId: currentUser,
              users:[currentUser,toUserId],
              timeBegin:now,
              lastMessageTs: now,
              activated: true
            };
            chatId=bz.cols.chats.insert(chat);
          }
          if(chatId){
            message={
              userId:currentUser,
              toUserId: toUserId,
              chatId: chatId,
              text: text,
              timestamp: now,
              keyMessage: keyMessage,
              type: type,
              seen: false,
              associatedPostId: request.associatedPostId
            };
            messageId=bz.cols.messages.insert(message);
            bz.cols.chats.update({_id: chatId},{$set: {lastMessageTs: now}});
            if (messageId){
              ret={success: true, result:messageId};
            }else{
              //error
              ret={success: false, error:bz.const.errors.global.errorWriteInDb};
            }
          }else{
            //error
            ret={success: false, error:bz.const.errors.messagesChats.chatNotFoundOrNotCreated};
          }
        }
        else{
          //error
          ret={success: false, error: validate.error};
        }
      }else{
        //error
        ret={success: false, error: bz.const.errors.messagesChats.destinationUserNotFound};
      }
    }else{
      //error not logged
      ret={success: false, error: bz.const.errors.global.notLogged};
    }
    return ret;
  },
  deleteMessages: function(messagesId){
    var ret, messages, currentUser;
    check(messagesId,[String]);
    currentUser=Meteor.userId();
    if(messagesId && Array.isArray(messagesId)&& messagesId.length>0){
      if(currentUser){
        messages=bz.cols.messages.find({_id:{ $in:messagesId},userId: currentUser}).fetch();
        if(messages && messages.length>0){
          bz.cols.messages.remove({_id:{ $in:messagesId},userId: currentUser});
          ret={success: true}
        }else{
          //error
          ret={success: false, error: bz.const.errors.global.dataNotFound};
        }
      }else{
        //error not logged
        ret={success: false, error: bz.const.errors.global.notLogged};
      }
    }else{
      //error
      ret={success: false, error: bz.const.errors.messagesChats.badInputIds};
    }
    return ret;
  },
  deleteChats: function(chatsId){
    var ret,currentUser,chats;
    check(chatsId,[String]);
    currentUser=Meteor.userId();
    if(chatsId && Array.isArray(chatsId)&& chatsId.length>0) {
      if (currentUser) {
        chats=_.map(bz.cols.chats.find({_id:{$in:chatsId},users:currentUser}).fetch(), function(item){
          return item._id;
        });
        if(chats && chats.length>0){
          bz.cols.messages.remove({chatId:{$in:chats}});
          bz.cols.chats.remove({_id:{$in:chats}});
          ret={success: true};
        }else{
          //error
          ret={success: false, error: bz.const.errors.global.dataNotFound};
        }
      } else {
        //error not logged
        ret = {success: false, error: bz.const.errors.global.notLogged};
      }
    }else{
      //error
      ret={success: false, error: bz.const.errors.messagesChats.badInputIds};
    }
    return ret;
  },
  validate: function(messageText){
    var ret;
    if(messageText){
      if(true){
        ret={success: true};
      }else{
        //error foul language detected
        ret={success: false, error: bz.const.errors.messagesChats.foulLanguageInMessage};
      }
    }else{
      //error
      ret={success: false,error: bz.const.errors.messagesChats.emptyTextMessage};
    }
    return ret;
  }
};