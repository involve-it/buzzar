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
    searchSelector = Session.get('bz.control.search-selector');

    ret = bz.cols.posts.find(searchSelector, {limit:3}).fetch();
    /*console.log(ret);*/
    return ret;
  }
});

Template.bzAroundYouItem.helpers({
  
  categoryType: function() {
    
    /*var postTypes;
    switch (postTypes) {}*/
    
    return "trade";  
  },
  getAvatarImg: function () {},
  getRank: function() {}
  
});