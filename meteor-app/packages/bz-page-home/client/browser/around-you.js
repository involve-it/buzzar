/**
 * Created by root on 9/15/15.
 */

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

  categoryType: function() {
    /*debugger;

    var postsId = bz.cols.posts.find({_id: this._id}).fetch()[0].type;
    
    if(postsId) {
      var ret = bz.cols.siteTypes.find({_id: postsId}).fetch()[0].name;
    }*/
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
    
  
  },
  getAvatarImg: function () {},
  getRank: function() {},
  getTimeStamp: function(){
    return Date.now();
  },
  getUserName: function() {
    var ret = '';
    if(Meteor.user()) {
      ret = Meteor.user().username.toCapitalCase();
    }
    return ret;
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