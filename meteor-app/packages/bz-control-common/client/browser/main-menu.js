/**
 * Created by Ashot on 9/27/15.
 */
Template.bzControlMenuHashes.onCreated(function(){
  Meteor.subscribe('bz.hashes.all');
});
Template.bzControlMenuHashes.helpers({
  getUserHashes: function(){
    return bz.cols.hashes.find();
  }
});

Template.bzInnerMenuLeft.helpers({
  getCurrentUserName: function(){
    return Meteor.user() && Meteor.user().username;
  },
  getUserAvatar: function(){
    var ret = '/img/content/avatars/avatar-no.png';
    var user = Meteor.user();
    if(user && user.profile && user.profile.image){
      ret = user.profile.image;
    }
    return ret;
  }
})
Template.bzInnerMenuLeft.events({
  'click .btn-drop': function(e) {
    e.preventDefault();

    var menuHeight = $("[role='expand-menu-dropdown']").height();
    if($("[role='user-expand-menu']").hasClass("user-panel-expand")) {
      $("[role='expand-menu-trigger']").removeClass("arrow-down");
      $("[role='user-expand-menu']").removeClass("user-panel-expand");
      $("[role='expand-menu-dropdown']").parent().height(0);
    } else {
      $("[role='expand-menu-trigger']").addClass("arrow-down");
      $("[role='user-expand-menu']").addClass("user-panel-expand");
      $("[role='expand-menu-dropdown']").parent().height(menuHeight);
    }
  }
});
