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
  getCategoryTags: function(){
    return bz.cols.tags.find({category: true}).fetch();
  },
  getRelatedTags:function(){
    bz.cols.tags.find({});
    var category_tag;
    category_tag=Session.get('bz.search.tag-category');
    if(category_tag) {
      console.info('1');
      $('.tags-related').find('select').dropdown('clear');
      return bz.cols.tags.find({related:category_tag}).fetch();
    }
    else{
      console.info('2');
      return bz.cols.tags.find().fetch();
    }
  }
});
Template.TagsFilter.events({
  'change div.tags-category select ':function(event,v) {
    console.info(v.$('.tags-category').find('select').val());
    Session.set('bz.search.tag-category',v.$('.tags-category').find('select').val())
  }
});