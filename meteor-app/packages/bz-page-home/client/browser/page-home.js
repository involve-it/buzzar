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
      ret = appName;// + '<span>ound</span>';
    } else {
      ret = appName;
    }
    return Spacebars.SafeString(ret);
  }
});



Template.bzAdCategoryButton.helpers({
  categoryType: function() {
    return this.type;
    //return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  }
});

Template.bzAdCategoryButton.events({
  'click .js-category-type-btn': (e, v)=> {
    var type = bz.cols.postAdTypes.findOne({intName: e.target.innerText}) || {}
    var catName = type.intName;
    if(catName) {
      if(type.hasRoute){
        Router.go('/' + catName);
      } else {
        bz.ui.putCategoriesToSession(catName);
        bz.ui.alert(`You filtered results by the "${catName.toCapitalCase()}" category, to undo this click "All" in top search section`);
      }
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





