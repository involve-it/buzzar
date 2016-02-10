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


Template.pageHome.onRendered(function() {
  
  $(document).foundation();

  
  
  $(document).ready(function() {

    
    
    $(window).on({
      'resize': function(e) {
        resizeBzSearch();
      },
      'load': function(e) {
        resizeBzSearch();
      }
    });
  });

  if(!this._rendered) {
    this._rendered = true;
    resizeBzSearch();
  }

function resizeBzSearch() {
  var $controlBtnList, $windowWidth, $boxSearch;

  $windowWidth =      $(window).width() - 30;
  $controlBtnList =   $('.control--category-list-buttons').width();
  $boxSearch =        $('.box-search');


  if($windowWidth > $controlBtnList) {
    $boxSearch.css('width', $controlBtnList);
  } else {
    $boxSearch.css('width', '');
  }
}
  
});

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



Template.aroundYou.onRendered(function() {
  $('.grid').masonry({
    //isFitWidth: true,
    itemSelector: '.grid-item'
  });

  Meteor.startup(function() {
    $(window).resize(function() {
      $('.grid').masonry();
    });
  });
  
});





