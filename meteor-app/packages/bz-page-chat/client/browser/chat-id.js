/**
 * Created by ashot on 5/20/15.
 */

Template.bzChatId.onRendered(function() {


  var userAgent = navigator.userAgent;
  var ios = /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);

  
  function resizeWinChat() {
    var $win = $(window).height(),
        headerH = $('.bz-nav-bg-default').outerHeight(),
        chatHeader = $('.bz-user-owner-toolbar').outerHeight(),
        chatTextInput = $('.bz-user-inputs-messages').outerHeight(),
        paddingBorder = (mobile) ? 1 : 41;
    
    if(mobile) {
      $('.bz-footer').outerHeight(0).css('display','none');
      var footerH = 0;
    } else {
      var footerH = $('.bz-footer').outerHeight();
    }
    
    $('.bz-messages-container').css('height', ( $win - headerH - footerH - chatHeader - chatTextInput - paddingBorder) );
  }
  
  Meteor.startup(function() {
    $(window).resize(function(e) {
      resizeWinChat();
    });  
  });
  
  resizeWinChat();
  
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


Template.bzChatId.onDestroyed(function() {
  $(window).off('resize');
});


Template.bzChatId.created = function () {
  currentUser = Meteor.user();
  //friendUserId = Router.current().params.userId;
};


Template.bzChatId.rendered = function () {
//todo: Don't forget turn on:
// Trail();
    var that = this;
    scrollMessages();
    var lastCount = this.data.messages.count();
    Deps.autorun(function() {
        /*var newCount = that.data.messages.count();
        if(newCount > lastCount) {
            scrollMessages();
        }*/
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
          sendMessage.call(this, messageText, this.chat, this.user._id);
          v.$('#message-input').val('');
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
            sendMessage.call(this, messageText, this.chat, this.user._id);
            v.$('#message-input').val('');
          }
      }
  }
});

Template.bzChatId.helpers({
  getMessages: function (a, b) {
    var messages = this.messages
    return messages;
  }    
});



Template.bzMessageToolbar.helpers({
  getFriendUserName: function() {
    var friendUserName = this.user.username,
        partEmail;
    if(friendUserName) {
      return friendUserName;
    } else {
      partEmail = this.user.emails[0].address;
      return partEmail.split('@')[0];
    }
  },
  getFriendAvatarUrl: function(){
      return this.user.profile && this.user.profile.image && this.user.profile.image.data || "/img/content/avatars/avatar-no.png";
  }
});