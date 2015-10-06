/**
 * Created by douson on 09.07.15.
 */

Template.userSettings.onCreated(function () {
});
Template.userSettings.onRendered(function () {
  if(Meteor.userId() === this.data._id) {
    $('.js-send-message-btn').addClass('disabled');
  }
});

Template.userSettings.helpers({
  userName: function () {
    // username of logged in user
    return this.username;
  },
  getIdProfile: function () {
    //console.log('ID профайла пользователя ' + this._id);
    return Meteor.absoluteUrl() + 'user/' + this._id;
  },
/*  getIdGuestUser: function () {
    //console.log('ID гостя ( залогиненного ) ' + Meteor.userId());
    return Meteor.userId();
  },*/
  getFaceBookDetails: function () {
    return 'N/A';
  },
  getStatusLocation: function () {
  }
});


Template.userSettings.events({
  'click [data-action=share-profile]': function (event, template) {
  },
  'click [data-action=edit-avatar]': function (event, template) {
    /*IonActionSheet.show({
          titleText: 'Edit picture',
          buttons: [
            {text: 'Photo Library'},
            {text: 'Take Photo'}
          ],
          cancelText: 'Cancel'
        }
    )*/
  },
  'click .js-send-message-btn': function(e,v){
    /*var qs = {
      toUser: this._id
    }*/
    //debugger;
    if(Meteor.userId() !== this._id) {
      var chatId = bz.buz.chats.createChatIfFirstMessage(Meteor.userId(), this._id);
      Router.go('/chat/' + chatId);
    }
  }
});

