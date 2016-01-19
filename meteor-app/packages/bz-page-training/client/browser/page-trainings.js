/**
 * Created by ashot on 8/20/15.
 */
var isOn = false;
homeVideo;

Template.pageTrainings.events({
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

Template.pageTrainings.rendered = function () {
  //$('select').foundationSelect();
  $(document).foundation();
};
Template.pageTrainings.rendered = function () {
  var view = this,
    video = view.$('.js-header-bg-video');
  homeVideo = video[0];
  getScreenSize();

  if( getScreenSize() === 'lg' ) {
    if( video.get(0) && video.get(0).canPlayType ) {
      video.get(0).playbackRate = 0.5; /* 0.5 is half speed (slower) */
      video.get(0).play();
      video.addClass("video-playing");
      view.$(".bz-slide-show-list").addClass("hide");
      console.log(getScreenSize());
    }
  } else if( getScreenSize() === 'md' ) {
    console.log(getScreenSize());
    /*console.log('запустить только slide');*/
  }

  if( !$(video.get(0)).hasClass("video-playing") ) {
    /*video.get(0).pause();*/
    video.get(0).remove();
  }

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
  function initSlideshowOrVideo() {}
};
