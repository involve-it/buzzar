/**
 * Created by root on 9/15/15.
 */

Template.bzAroundYouItem.rendered = function() {

  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
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

    var postsId = bz.cols.posts.find({_id: this._id}).fetch()[0].type;
    
    if(postsId) {
      var ret = bz.cols.siteTypes.find({_id: postsId}).fetch()[0].name;
    }
    return ret;
    
  
  },
  getAvatarImg: function () {},
  getRank: function() {},
  getTimeStamp: function(){
    return Date.now();
  }
});