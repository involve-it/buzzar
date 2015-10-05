/**
 * Created by Ashot on 9/19/15.
 */
bz.help.makeNamespace('bz.buz.chats');

sendMessage = function (messageText, chatId, friendUserId){
  bz.cols.messages.insert({
    userId: currentUser._id,
    toUserId: friendUserId,
    chatId: chatId,
    text: messageText,
    timestamp: Date.now(),
    keyMessage: 'own-message'
  });
  scrollMessages();
  addConversationIfFirstMessage(currentUser._id, friendUserId);
}
scrollMessages = function () {
  var elem = document.getElementsByClassName("messages-container");
  elem[0].scrollTop = elem[0].scrollHeight;
  //$('.messages-container').animate({"scrollTop": $('.messages-container')[0].scrollHeight}, "100");
  //this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
}
addConversationIfFirstMessage = function(userFrom, userTo) {
  debugger;
  //var usersArr = [userFrom, userTo];
  /*bz.cols.chats.remove({
    userId: userTo
  });
  bz.cols.chats.remove({
    userId: userFrom
  });*/
  var chats1 = bz.cols.chats.findOne({
    userId: userFrom,
    users: {$in: [userTo]}
  });
  var chats2 = bz.cols.chats.findOne({
    userId: userTo,
    users: {$in: [userFrom]}
  });
  debugger;
  if(!chats1 && !chats2) {
    bz.cols.chats.insert({
      userId: userFrom,
      users: [userTo],
      timeBegin: Date.now()
    })
    bz.cols.chats.insert({
      userId: userTo,
      users: [userFrom],
      timeBegin: Date.now()
    });
  }
}
bz.buz.chats.addConversationIfFirstMessage = addConversationIfFirstMessage;

Template.registerHelper("timestampToTime", function (timestamp) {
  var date = new Date(timestamp);
  return moment(date).fromNow();
});

