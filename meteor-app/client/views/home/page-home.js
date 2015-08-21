/**
 * Created by ashot on 8/20/15.
 */
Template.pageHome.events({
  'click .js-read-more': function (e,v){
    v.$('.js-about-us').toggle();
    v.$('.js-read-more span').toggle();
  }
})