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
  },
  'mouseover .js-pause-header-video': function(e,v){
    homeVideo && homeVideo.pause();
  },
  'mouseout .js-pause-header-video': function(e,v){
    homeVideo && homeVideo.play();
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
      ret = appName;// + '<span>ound</span>';
    } else {
      ret = appName;
    }
    return Spacebars.SafeString(ret);
  }
});
homeVideo;
Template.pageHome.rendered = function () {
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
      }
  } else if( getScreenSize() === 'md' ) {
    console.log('запустить только slide');
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


Template.bzAdCategoryButton.helpers({
  categoryType: function() {
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  }
});

Template.bzAdCategoryButton.events({
  'click .js-category-type-btn': (e, v)=> {
    var catName = e.target.innerText;
    if(catName) {
      bz.ui.putCategoriesToSession(catName);
      bz.ui.alert(`You filtered results by the "${catName.toCapitalCase()}" category, take Category Filter off in the top search section`);
    }
  }
});