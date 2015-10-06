/**
 * Created by Ashot on 9/19/15.
 */
bz.help.makeNamespace('bz.buz.chats');

sendMessage = function (messageText, chat, friendUserId){
  bz.cols.messages.insert({
    userId: currentUser._id,
    toUserId: friendUserId,
    chatId: chat._id,
    text: messageText,
    timestamp: Date.now(),
    keyMessage: 'own-message',
    seen: false
  });
  createChatIfFirstMessage(currentUser._id, friendUserId);
  makeChatActive(chat);
  scrollMessages();

}
scrollMessages = function () {
  var elem = document.getElementsByClassName("messages-container");
  elem[0].scrollTop = elem[0].scrollHeight;
  //$('.messages-container').animate({"scrollTop": $('.messages-container')[0].scrollHeight}, "100");
  //this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
}
makeChatActive = function(chat){
  //var chat = bz.cols.chats.findOne(chatId);
  if(chat && !chat.active) {
    //chat && (chat.active = true);
    bz.cols.chats.update(chat._id, {$set: {activated: true}});
  }
}
createChatIfFirstMessage = function(userFrom, userTo) {
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
  _.each(chatsAll, function(item){
    //bz.cols.chats.remove(item._id);
  });
  /*bz.cols.chats.remove({
    userId: userFrom
  });*/
  if(chatsAll.length === 0) {
    /*bz.cols.chats.insert({
      userId: userFrom,
      users: [userTo],
      timeBegin: Date.now()
    });*/
    chatId = bz.cols.chats.insert({
      userId: userFrom,
      users: [userTo, userFrom],
      timeBegin: Date.now(),
      activated: false // we just create record in DB, but we don't wanna show this conv-n to the other user
    });
  } else {
    chatId = chatsAll[0]._id
  }
  return chatId;
}
bz.buz.chats.createChatIfFirstMessage = createChatIfFirstMessage;

getUniqueChatsForUser = function(userId, all){
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
  if(all){
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
}

Template.registerHelper("timestampToTime", function (timestamp) {
  var date = new Date(timestamp);
  return moment(date).fromNow();
});
Meteor.startup(function(){
  /*bz.cols.messages.find().observeChanges({
    added: function(a, b){
      console.log(a);
      console.log(b);
    }
  });*/
  (function() {
    var initializing = true;
    bz.cols.messages.find().observeChanges({
      added: function(id, doc) {
        if (!initializing) {
          console.log(doc);
        }
      }
    });
    initializing = false;
  })();
});

