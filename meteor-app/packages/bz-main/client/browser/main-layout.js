/**
 * Created by douson on 06.07.15.
 */
bz.help.maps.initLocation();

Template.mainLayout.created = function () {}

Template.mainLayout.rendered = function () {
  $(document).foundation({
    offcanvas : {
      //move, overlap_single or overlap, reveal
      open_method: 'move',
      close_on_click : true
    }
  });
  layoutRenderedLazyLoad();
};

Template.mainLayoutHome.rendered = function () {
  $(document).foundation({
    offcanvas : {
      //move, overlap_single or overlap, reveal
      open_method: 'move',
      close_on_click : true
    }
  });
  layoutRenderedLazyLoad();
};




Template.changeLanguage.rendered = function() {
  /*
  var lang = window.navigator.userLanguage || window.navigator.language;
  //temporarily getting just first two letters of language (i.e. for en-US we'll take 'en' only).
  if (lang){
    if (lang.length > 2) {
      lang = lang.substr(0, 2);
    }
  } else {
    // English is default
    lang = "en";
  }
  */
   
  var lang;
  lang = Meteor.users.findOne(Meteor.userId()).profile.settings.language;
  
  if(lang) {
    T9n.setLanguage(lang);
    $('.dropdown-choose-lang').val(lang);
  }
};


Template.changeLanguage.events({
  'change .dropdown-choose-lang': function(e, v){
    var lang = e.target.value;
    
    if(Meteor.users.findOne(Meteor.userId()).profile.settings.language !== lang) {
      T9n.setLanguage(lang);
      $('.dropdown-choose-lang').val(lang);
    
      Meteor.call('uiSetUserLanguage', lang, function(error, result) {
        if (error) return console.log(error.reason);
      });
    }
  }
});



