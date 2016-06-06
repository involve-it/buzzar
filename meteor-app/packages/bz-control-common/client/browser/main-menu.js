/**
 * Created by Ashot on 9/27/15.
 */
Template.bzControlMenuHashes.onCreated(function(){
  Meteor.subscribe('bz.hashes.all');
});

Template.bzControlMenuHashes.helpers({
  getUserHashes: function(){
    var ret = bz.cols.hashes.find({userId: Meteor.userId()});
    return (ret.count() > 0) ? ret : '';
  },
  getMenuHashName: function(){
    var menuLinkText = '#' + this.details.text + ' @' + this.details.locName;
    return menuLinkText;
  },
  getMenuLinkText: function(){
    //var menuLinkText = '#' + this.details.text + ' @' + ;
    var url = '/home?locationName=' + this.details.locName + '&searchText=' + this.details.text + '';
    return url;
    //return encodeURIComponent(url);
  }
});

Template.bzControlMenuHashesMainMenu.onRendered(function() {
  var el = $('.left-off-canvas-menu');
  if(el) {
    return el.find('.dropdown-hashes-menu-main-menu').remove();
  }
});

Template.bzControlMenuHashesMainMenu.helpers({
  isHashesUserId: function () {
    return bz.cols.hashes.find({userId: Meteor.userId()}).fetch();
  },
  getUserHashes: function () {
    return bz.cols.hashes.find({userId: Meteor.userId()});
  },
  getMenuHashName: function () {
    var menuLinkText = '#' + this.details.text + ' @' + this.details.locName;
    return menuLinkText;
  },
  getMenuLinkText: function () {
    //var menuLinkText = '#' + this.details.text + ' @' + ;
    var url = '/home?locationName=' + this.details.locName + '&searchText=' + this.details.text + '';
    return url;
    //return encodeURIComponent(url);
  }
});

Template.bzInnerMenuLeft.onCreated(function() {
  this.someUserData = new ReactiveVar(false);
});

Template.bzInnerMenuLeft.helpers({
  getUser: function() {
    var userId = Meteor.userId(), ins = Template.instance(), innerObj = {}, usegObj = {};
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
  /*getCurrentUserName: function(){
    return Meteor.user() && Meteor.user().username;
  },
  getUserAvatar: function(){
    var ret = '/img/content/avatars/avatar-no.png';
    var user = Meteor.user();
    if(user && user._getAvatarImage()){
      ret = user._getAvatarImage();
    }
    return ret;
  }*/
});

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

