/**
 * Created by ashot on 5/20/15.
 */

Template.bzChatId.onRendered(function() {

    $.each($('textarea[data-autoresize]'), function() {
        var offset = this.offsetHeight - this.clientHeight;
        var resizeTextarea = function(el) {
            $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };

        $(this).on('keyup input', function() {
            if(this.scrollHeight > 44) {
                resizeTextarea(this);
            }
        }).removeAttr('data-autoresize');
    });

});

Template.bzChatId.created = function () {
  currentUser = Meteor.user();
  friendUserId = Router.current().params.userId;
};

Template.bzChatId.rendered = function () {
//todo: Don't forget turn on:
// Trail();
    var that = this;
    scrollMessages();
    var lastCount = this.data.messages.count();
    Deps.autorun(function() {
        var newCount = that.data.messages.count();
        if(newCount > lastCount) {
            scrollMessages();
        }
    });
};

Template.bzChatId.events({
  'click #send-btn': function (e, v) {
    if(!currentUser){
      alert('please login');
    } else {
      var messageText = v.$('#message-input').val();
        if($.trim(messageText) === "") {
            return false;
        }
        if(messageText != '') {
          sendMessage.call(this, messageText, v);
        }//end if
    }
  },
  'keydown #message-input': function(e, v) {

      if(e.which === 13) {
          e.preventDefault();
          //console.log("you pressed enter");
          var messageText = v.$('#message-input').val();
          if($.trim(messageText) === "") {
              return false;
          }
          if(messageText != '') {
            sendMessage.call(this, messageText, v);
          }
      }
  }
});

Template.bzChatId.helpers({
  getMessages: function (a, b) {
    var messages = this.messages
    return messages;
  },
    getFriendUserName: function() {
        var friendUserName = this.user.username,
            partEmail;
        if(friendUserName) {
            return friendUserName;
        } else {
            partEmail = this.user.emails[0].address;
            return partEmail.split('@')[0];
        }

    }
});

