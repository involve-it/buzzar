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

  getCity: function(){
    return this.profile.city;
  },
  getPostsCount: function(){
    return bz.cols.posts.find({userId: this._id}).count();
  },
  getReviewsCount: function(){
    return bz.cols.reviews.find({userId: this._id}).count();
  },
  getFIO: function(){
    return this.profile.firstName + ' ' + this.profile.lastName;
  },
  getPhoneStatus: function () {
    return this.profile.phone.status;
  },
  getSkypeStatus: function () {
    return this.profile.skype.status;
  },
  getVKStatus: function () {
    return this.profile.vk.status;
  },
  getTwitterStatus: function () {
    return this.profile.twitter.status;
  },
  getFaceBookStatus: function () {
    return this.profile.facebook.status;
  },
  getPhoneNumber: function(){
    if (this.profile.phone.status == "1"){
      return this.profile.phone.number;
    }
    else {
      return 'Hidden';
    }
  },
  getSkype: function(){
    if (this.profile.skype.status == "1"){
      return this.profile.skype.account;
    }
    else {
      return 'Hidden';
    }
  },
  getVK: function(){
    if (this.profile.vk.status == "1"){
      return this.profile.vk.url;
    }
    else {
      return 'Hidden';
    }
  },
  getFacebook: function(){
    if (this.profile.facebook.status == "1"){
      return this.profile.facebook.url;
    }
    else {
      return 'Hidden';
    }
  },
  getTwitter: function(){
    if (this.profile.twitter.status == "1"){
      return this.profile.twitter.url;
    }
    else {
      return 'Hidden';
    }
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
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this._id);
      Router.go('/chat/' + chatId);
    }
  }
});

