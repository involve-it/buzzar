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
});

Template.pageHome.rendered = function () {
  //$('select').foundationSelect();
  $(document).foundation();
};

Template.bzMeteorLogo.helpers({
  getLocalAppName: function(){
    var appName = T9n.get('APP_NAME'), ret;
    if(T9n.getLanguage() === 'en'){
      ret = appName + '<span>ound</span>';
    } else {
      ret = appName;
    }
    return Spacebars.SafeString(ret);
  }
});

Template.pageHome.rendered = function () {
  var view = this,
      video = view.$('#bz-bg-video');
  
  function getScreenSize() {
    var res;
    if(matchMedia) {
      var lg = window.matchMedia("(min-width: 1024px)").matches,
          md = window.matchMedia("(min-width: 640px) and (max-width: 1024px)").matches,
          sm = window.matchMedia("(max-width: 640px)").matches;
      
      if(lg) {
        res = 'lg';
      } else if (md) {
        res = 'md';
      } else if(sm) {
        res = 'sm';
      }
    }
    
    return res;
  }

  getScreenSize();
  
  if( getScreenSize() === 'lg' ) {
      if( video.get(0) && video.get(0).canPlayType ) {
        video.get(0).play();
        video.addClass("video-playing");
        view.$(".bz-slide-show-list").addClass("hide");
      }
    
  } else if( getScreenSize() === 'md' ) {
    console.log('запустить только slide');
  }
   
  
  function initSlideshowOrVideo() {}
  
};
