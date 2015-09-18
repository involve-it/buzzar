/**
 * Created by root on 9/15/15.
 */

Template.bzAroundYouItem.rendered = function() {

  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};


Template.bzAroundYouItem.helpers({
  categoryType: function() {
    return 'trade';  
  },
  getAvatarImg: function () {},
  getPhotoItem: function () {},
  getUserName: function() {},
  getPrice: function() {},
  getTitle: function() {},
  getDescription: function() {},
  getRank: function() {}
  
});