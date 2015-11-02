/**
 * Created by root on 9/15/15.
 */

Template.bzAroundYouItem.onCreated(function(){
  Meteor.subscribe('bz.users.all');
});

Template.bzAroundYouItem.rendered = function() {

  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
  
  var lineH = $('.bz-content .post-item-text').css('line-height');
  if (Number.parseInt(lineH) !== 'NaN'){
    lineH = Number.parseInt(lineH);
  } else {
    lineH = 20;
  }
  $('.bz-content .post-item-text').css('max-height', lineH * 2);
};

Template.aroundYou.helpers({
  aroundItem: function() {
    var searchSelector = Session.get('bz.control.search-selector');
    var ret = bz.cols.posts.find(searchSelector, {limit:3}).fetch();

    return ret;
  }
});

Template.bzAroundYouItem.helpers({
  getPostOwner: function(){
    return Meteor.users.findOne(this.userId);
  },
  categoryType: function() {
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  },
  getRank: function() {},
  getTimeStamp: function(){
    return Date.now();
  },
  getImgSrc: function(){
    var ret, phId = this.details.photos && this.details.photos[0];
    if(phId){
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret.data;
    }
    return ret;
  }
});

Template.bzUserProfileAroundYou.helpers({
  getNameFormatted: function () {
    /*return Meteor.users.find({
     _id: {$in: _.without(this.users, Meteor.userId())}
     });*/
  },
  isOnline1: function () {
    debugger;
    return true;
  }
});