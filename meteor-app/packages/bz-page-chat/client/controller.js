/**
 * Created by Ashot on 9/19/15.
 */
bz.help.makeNamespace('bz.bus.chats');

sendMessage = function (messageText, chat, friendUserId) {
  var  msgTs = Date.now();

  createChatIfFirstMessage(currentUser._id, friendUserId).then(function() {
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

      bz.cols.chats.update({
              _id: chat._id
          },{$set:{lastMessageTs: msgTs}}
      );
      scrollMessages();

  })

};
scrollMessages = function () {
  var elem = $('.bz-messages-container');
  
  if(elem.length) {
    elem.stop().animate({scrollTop: elem[0].scrollHeight}, 250, 'swing');
  }
};

makeChatActive = function (chat) {
  //var chat = bz.cols.chats.findOne(chatId);
  if (chat && !chat.active) {
    //chat && (chat.active = true);
    bz.cols.chats.update(chat._id, {$set: {activated: true}});
  }
};
createChatIfFirstMessage = function (userFrom, userTo) {
  //var usersArr = [userFrom, userTo];
  /*bz.cols.chats.remove({
   userId: userTo
   });
   bz.cols.chats.remove({
   userId: userFrom
   });*/
  var ret = new Promise((resolve, reject) => {
      Meteor.call('bz.chats.fromToUser', userFrom, userTo, function(err, lastMessageChat) {
        var chatId, chats1, chats2, chatsAll;
        /*chats1 = bz.cols.chats.find({
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
        /!*bz.cols.chats.remove({
         userId: userFrom
         });*!/*/
        if (!lastMessageChat) {
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
          chatId = lastMessageChat._id
        }
        resolve(chatId);
  // return chatId;
      })

  })
  return ret;
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
  var options = {
    // era: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    //weekday: 'long',
    //timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  //return '';
  return date.toLocaleDateString( Session.get("bz.user.language"), options);
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