/**
 * Created by Ashot on 9/26/15.
 */
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
  },
  getImagesArrayReactive: function(){
    return {
      imagesArr: avatarThumbnailReactive
    };
  }
});
Template.avatarThumbnail.events({
  'click .js-edit-image-icon': function () {
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  }
  /*'click .js-image-upload-modal': function (event, template) {
   },*/
});

Template.bzUserProfileBasic.rendered = function () {
  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};

Template.bzUserProfileBasic.onCreated(function() {
  this.someUserData = new ReactiveVar(false);
});

Template.bzUserProfileBasic.helpers({
  getUser: function() {
    var userId = this._id, ins = Template.instance(), innerObj = {}, usegObj = {};
    /*console.info(Router.current().params._id);
    console.info(this._id);*/
    if (ins.someUserData.get() === false) {
      Meteor.call('getUser', userId, function(e, r){
        if(e) {
          //error
        } else {
          innerObj = r.result;

          _.each(innerObj, function(value, key, list) {

            if(key === 'image') {
              usegObj['image'] = list.image
            }

          });
          usegObj['username'] = innerObj.username;
          ins.someUserData.set(usegObj);
        }
      });
    }
    return ins.someUserData.get();
  }
  
  /*,
  belongsToCurrentUser: function (e, v) {
    return this._id === Meteor.userId();
  },
  getCurrentPostId: function(){
    var post = bz.bus.posts.getCurrentPost();
    return post && post._id;
  }*/
  
});

Template.bzUserProfileBasic.events({
  'click .js-send-message-btn': function (e, v) {
    /*var qs = {
     toUser: this._id
     }*/
    if (Meteor.userId() !== this._id) {
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this._id);
      Router.go('/chat/' + chatId);
    }
  }
})
Template.bzUserProfileBasic.onRendered(function () {
  if (this.data && Meteor.userId() === this.data._id) {
    $('.js-send-message-btn').addClass('disabled');
  }
});

