/**
 * Created by Ashot on 9/21/15.
 */
loggedInUserLazyLoad = function () {
  var userId = Meteor.userId();
  Meteor.subscribe('bz.messages.unseenToMe', userId);

  (function () {
    var initializing = true;
    bz.cols.messages.find({toUserId: userId, seen: false}).observeChanges({
      added: function (id, doc) {
        if (Meteor.userId() === doc.toUserId) {

          if (!initializing) {
            //console.log(doc);
            var userObj = Meteor.users.findOne(doc.userId);
            bz.buz.chats.showMessageModal(doc, userObj, id);
            
            bz.buz.chats.showbzAlerMessage(doc, userObj, id);
          }
        }
      }
    });
    initializing = false;
  })();
};

Meteor.startup(function(){
  var userId = Meteor.userId();
  if(userId){
    setTimeout(function(){
      loggedInUserLazyLoad(userId);
    }, 10);
  }
});

