/**
 * Created by root on 9/15/15.
 */
Template.bzHomePopular.helpers({
  aroundItem: function() {
    var searchSelector = '';
    var ret = bz.cols.posts.find({}, {limit:30});

    return ret;
  }
});


Template.bzHomePopularItem.onCreated(function(){
  Meteor.subscribe('bz.users.all');
});

Template.bzHomePopularItem.rendered = function() {

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

Template.bzHomePopularItem.helpers({
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