/**
 * Created by douson on 09.07.15.
 */

Template.userSettings.onCreated(function () {
  Meteor.subscribe('profileDetails-another');
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
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'city'});
    return details && details.value;
  },
  getPostsCount: function(){
    return bz.cols.posts.find({userId: this._id}).count();
  },
  getReviewsCount: function(){
    return bz.cols.reviews.find({userId: this._id}).count();
  },
  getFIO: function(){
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'firstName'});
    var fio = details && details.value;
    details = bz.cols.profileDetails.findOne({userId: this._id, key:'lastName'});
    fio= fio +' ' + (details && details.value);
    return fio;
  },
  getPhoneStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'phone'});
    if (!details)
    {
      return '0'
    }
     else
    {
      return details && details.policy;
    }
  },
  getSkypeStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'skype'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getVKStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'vk'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getTwitterStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'twitter'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getFaceBookStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'facebook'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getPhoneNumber: function(){
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'phone'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getSkype: function(){
    var details =  bz.cols.profileDetails.findOne({userId: this._id, key:'skype'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getVK: function(){
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'vk'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getFacebook: function(){
    var details =  bz.cols.profileDetails.findOne({userId: this._id, key:'facebook'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getTwitter: function(){
    var details =  bz.cols.profileDetails.findOne({userId: this._id, key:'twitter'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
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

