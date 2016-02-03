/**
 * Created by Ashot on 9/19/15.
 */
bz.help.makeNamespace('bz.bus.chats');

sendMessage = function (messageText, chat, friendUserId) {
  var  msgTs = Date.now();

  createChatIfFirstMessage(currentUser._id, friendUserId),
  makeChatActive(chat);

  bz.cols.messages.insert({
    userId: currentUser._id,
    user: {
      username:  currentUser.username,
      profile: {
        image:  currentUser.profile.image
      }
    },
    toUserId: friendUserId,
    chatId: chat._id,
    text: messageText,
    timestamp: msgTs,
    keyMessage: 'own-message',
    seen: false
  });

  chat.lastMessageTs = msgTs; // assign timestamp of the last message to the chat

  scrollMessages();

}
scrollMessages = function () {
  var elem = document.getElementsByClassName("bz-messages-container");
  elem[0].scrollTop = elem[0].scrollHeight;
  //$('.messages-container').animate({"scrollTop": $('.messages-container')[0].scrollHeight}, "100");
  //this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
}
makeChatActive = function (chat) {
  //var chat = bz.cols.chats.findOne(chatId);
  if (chat && !chat.active) {
    //chat && (chat.active = true);
    bz.cols.chats.update(chat._id, {$set: {activated: true}});
  }
}
createChatIfFirstMessage = function (userFrom, userTo) {
  //var usersArr = [userFrom, userTo];
  /*bz.cols.chats.remove({
   userId: userTo
   });
   bz.cols.chats.remove({
   userId: userFrom
   });*/
  var chatId, chats1, chats2, chatsAll;
  chats1 = bz.cols.chats.find({
    userId: userFrom,
    users: {$in: [userTo]}
  }).fetch();
  chats2 = bz.cols.chats.find({
    userId: userTo,
    users: {$in: [userFrom]}
  }).fetch();
  chatsAll = _.union(chats1, chats2);
  _.each(chatsAll, function (item) {
    //bz.cols.chats.remove(item._id);
  });
  /*bz.cols.chats.remove({
   userId: userFrom
   });*/
  if (chatsAll.length === 0) {
    /*bz.cols.chats.insert({
     userId: userFrom,
     users: [userTo],
     timeBegin: Date.now()
     });*/
    chatId = bz.cols.chats.insert({
      userId: userFrom,
      users: [userTo, userFrom],
      timeBegin: Date.now(),
      lastMessageTs: Date.now(),
      activated: false // we just create record in DB, but we don't wanna show this conv-n to the other user
    });
  } else {
    chatId = chatsAll[0]._id
  }
  return chatId;
}

getUniqueChatsForUser = function (userId, all) {
  var chatsArr = [];
  //var chats = _.union(bz.cols.chats.find({userId: userId}).fetch(), bz.cols.chats.find({users: {$in: [userId]}}).fetch());
  /*var chats = bz.cols.chats.find({
   $or: [

   {
   userId: userId
   },
   {
   users: {$in: [userId]}
   }
   ]
   }).fetch();*/
  /*var chats = bz.cols.chats.find({
   users: {$in: [userId]}
   }).fetch();
   var users1 = _.unique(_.map(chats, function(item) {
   return item.users[0]
   }));
   _.each(users1, function(usr){
   var chats1 = bz.cols.chats.findOne({
   userId: Meteor.userId(), users: {$in: [usr]}},
   {sort: {timeBegin: -1}});
   //chats.tsFormatted = moment(chats1.timeBegin).fromNow();
   chatsArr.push(chats1);
   });
   return chatsArr;

   */
  var chats;
  if (all) {
    var chats = bz.cols.chats.find({
      users: {$in: [userId]}
    }).fetch();
  } else {
    var chats = bz.cols.chats.find({
      users: {$in: [userId]},
      activated: true
    }).fetch();
  }

  return chats;
};

messageModals = {};
showMessageModal = function (msgObj, id) {

  var data = {
      messageText: msgObj.text,
      chatId: msgObj.chatId,
      user: msgObj.user
    },
    parentNode = $('.js-message-popup-placeholder')[0];
    messageModals[id] = Blaze.renderWithData(Template.bzChatMessagePopup, data, parentNode);
  
  /*$('.js-chat-message-modal').foundation('reveal', 'open');*/
  
  /*setTimeout(function () {
    a = id;
    hideMessageModal(id);
  }, 50000);*/
};

bzAlerMessage = {};
showbzAlerMessage = function(msgObj, userObj, id) {
  var text = msgObj.text,
      cutMessage = text.slice(0, 70) + '...';


  var data = {
    messageText: cutMessage,
    chatId: msgObj.chatId,
    user: userObj || msgObj.user //userObj maybe use someones
  };
  
  /*var parentNode = $('.message-loader')[0];
  bzAlerMessage[id] = Blaze.renderWithData(Template.sAlertCustom, data, parentNode);*/
  
  sAlert.success(data, {timeout: 5000});
};


hideMessageModal = function(msgId){
  $('.js-chat-message-modal').foundation('reveal', 'close');
  if(msgId) {
    var view = messageModals[msgId];
    view && Blaze.remove(view);
  }
};

Template.registerHelper("timestampToTime", function (timestamp) {
  var date = new Date(timestamp);
  //return '';
  return moment(date).fromNow();
});
Meteor.startup(function () {
  /*bz.cols.messages.find().observeChanges({
   added: function(a, b){
   console.log(a);
   console.log(b);
   }
   });*/
});

// EXPOSE EXTERNAL API:
bz.bus.chats.createChatIfFirstMessage = createChatIfFirstMessage;
bz.bus.chats.showMessageModal = showMessageModal;

bz.bus.chats.showbzAlerMessage = showbzAlerMessage;