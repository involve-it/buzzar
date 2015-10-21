/**
 * Created by Ashot on 9/26/15.
 */

Template.avatarThumbnail.onCreated(function () {
});

Template.bzUserProfileBasic.rendered = function () {

  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });

};

Template.avatarThumbnail.helpers({
  getAvatarImage: function (e, v) {
    var ret = this.image && this.image.data;
    if (ret) {

    } else {
      ret = '/img/content/avatars/avatar-no.png';
      /*var user = Meteor.users.findOne(Meteor.userId()),
       ret = '/img/content/avatars/avatar-no.png';
       if(user && user.profile && user.profile.image) {
       ret = user.profile.image;
       }*/
    }
    return ret;
  },
  canWrite: function () {
    return this.write;
  }
})
Template.avatarThumbnail.events({
  'click .js-edit-image-icon': function () {
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  }
  /*'click .js-image-upload-modal': function (event, template) {

   },*/
});
Template.bzUserProfileBasic.events({
  'click .js-send-message-btn': function (e, v) {
    /*var qs = {
     toUser: this._id
     }*/
    if (Meteor.userId() !== this._id) {
      var chatId = bz.buz.chats.createChatIfFirstMessage(Meteor.userId(), this._id);
      Router.go('/chat/' + chatId);
    }
  }
})
Template.bzUserProfileBasic.onRendered(function () {
  if (Meteor.userId() === this.data._id) {
    $('.js-send-message-btn').addClass('disabled');
  }
});
Template.bzUserProfileAroundYou.helpers({
  getNameFormatted: function () {
    var ret = '';
    if (this.userId && Meteor.users.findOne(this.userId)) {
      ret = Meteor.users.findOne(this.userId).username.toCapitalCase();
    }
    return ret;
  },
  isOnline1: function(){
    debugger;
    return true;
  }
});
