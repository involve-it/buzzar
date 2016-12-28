/**
 * Created by root on 9/15/15.
 */

Template.bzNewPosts.onCreated(function () {
  // this.getSearchData = new ReactiveVar(false);
  //this.getNearByData = new ReactiveVar(false);
});

Template.bzNewPosts.onRendered(function () {
  // Meteor.startup(function () {});
});

Template.bzNewPosts.helpers({
  getData: function () {
    var onlyActive = false, query = {}, ret = [], limit = bz.const.errors, options = {};
    if (onlyActive) {
      query = {
        visible: onlyActive,


      }
    }
    options.sort = {timestamp: -1 };
    options.limit = bz.const.search.AROUND_YOU_LIMIT;
    ret = bz.cols.posts.find(query, options);
    return ret;
  }
});