/**
 * Created by ashot on 8/20/15.
 */
var isOn = false;
Template.pageHome.events({
  'click .js-read-more': function (e,v){
    v.$('.js-about-us').toggleClass('hidden');
    v.$('.js-read-more span').toggleClass('hidden');
  },
  'keydown .js-search-text': function(e,v){
    if(!isOn) {
      v.$('.js-search-posts-link').click();
      $('.js-search-text-modal').val($('.js-search-text').val())
      $('.js-search-text-modal').focus();
    }
  }
})





Template.pageHome.rendered = function () {
  
  $('select').foundationSelect();
  $(document).foundation();

};




