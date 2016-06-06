/**
 * Created by douson on 4/9/16.
 */

/* cloud js render, bzUregUsefulAll */
Template.bzUregUsefulAll.onRendered(function() {
  let instView = this;
});
/* ./END cloud js render */

Template.categoriesUsefulAll.onRendered(function() {});

Template.categoriesUsefulAll.events({});

Template.categoriesUsefulAll.helpers({
  getCategoriesUsefulAll: function() {},
  count: function(getCategoriesUsefulAll) {
    return 1;
  }
});

Template.bzUnregLandingPosts.helpers({
  getPopularItems: function() {
    var ret;
    bz.cols.posts.find({});
    ret = bz.bus.search.searchePostsAroundAndPopular().aroundYou;
    return ret && ret.slice(0,4);
  }
});

Template.UnregLandingPostsItem.helpers({
  getImgSrc: function () {
    var ret, phId = this.details.photos && this.details.photos[0];
    if (phId) {
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret.data;
    }
    return ret;
  }
});