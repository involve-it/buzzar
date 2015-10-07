/**
 * Created by Ashot on 9/26/15.
 */

Template.avatarThumbnail.onCreated(function(){
});
Template.avatarThumbnail.helpers({
  getAvatarImage: function(e, v){
    //debugger;
    var ret = this.image;
    if (ret){

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
  canWrite: function(){
    return this.write;
  }
})
Template.avatarThumbnail.events({
  'click .js-edit-image-icon': function(){
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  }
  /*'click .js-image-upload-modal': function (event, template) {

   },*/
});
Template.bzUserProfileBasic.events({
  'click .js-send-message-btn': function(e,v){
    /*var qs = {
     toUser: this._id
     }*/
    debugger;
    if(Meteor.userId() !== this._id) {
      var chatId = bz.buz.chats.createChatIfFirstMessage(Meteor.userId(), this._id);
      Router.go('/chat/' + chatId);
    }
  }
})
Template.bzUserProfileBasic.onRendered(function(){
  if(Meteor.userId() === this.data._id) {
    $('.js-send-message-btn').addClass('disabled');
  }
});