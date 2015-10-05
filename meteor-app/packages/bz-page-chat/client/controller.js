/**
 * Created by Ashot on 9/19/15.
 */

//HELPERS:
sendMessage = function (messageText, view){
  bz.cols.messages.insert({
    userId: currentUser._id,
    toUserId: friendUserId,
    text: messageText,
    timestamp: new Date(),
    keyMessage: 'own-message'
  });
  scrollMessages();
  view.$('#message-input').val('');

}
scrollMessages = function () {
  var elem = document.getElementsByClassName("messages-container");
  elem[0].scrollTop = elem[0].scrollHeight;
  //$('.messages-container').animate({"scrollTop": $('.messages-container')[0].scrollHeight}, "100");
  //this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
}

Template.registerHelper("timestampToTime", function (timestamp) {
  var date = new Date(timestamp);
  return moment(date).fromNow();
});

