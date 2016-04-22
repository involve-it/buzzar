/**
 * Created by xvolkx48 on 20.04.2016.
 */
Template.TagsFilter.onCreated(function(){
  Meteor.subscribe('tags');
});

Template.TagsFilter.onRendered(function() {
  $('.ui.dropdown.post-tags').dropdown();
});

Template.TagsFilter.helpers({
  getTags: function(){
    return bz.cols.tags.find().fetch();
  }
});