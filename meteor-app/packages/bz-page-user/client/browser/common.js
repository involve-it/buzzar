/**
 * Created by Ashot on 9/26/15.
 */

Template.avatarThumbnail.onCreated(function(){
});
Template.avatarThumbnail.helpers({
  getAvatarImage: function(e, v){
    var user = Meteor.users.findOne(Meteor.userId()),
        ret = '/img/content/avatars/avatar-no.png';
    if(user && user.profile && user.profile.image) {
      ret = user.profile.image;
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
  },
  /*'click .js-image-upload-modal': function (event, template) {

   },*/
})