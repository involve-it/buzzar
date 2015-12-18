/**
 * Created by douson on 06.07.15.
 */
bz.help.maps.initLocation();

Template.mainLayout.created = function () {}

Template.mainLayout.rendered = function () {

  bz.ui.initFoundationOffCanvas();
  layoutRenderedLazyLoad();
  
};

Template.mainLayoutHome.rendered = function () {

  bz.ui.initFoundationOffCanvas();
  layoutRenderedLazyLoad();
  
};


function detectLanguage(){
  var lang = window.navigator.userLanguage || window.navigator.language;
  //temporarily getting just first two letters of language (i.e. for en-US we'll take 'en' only).
  if (lang){
    if (lang.length > 2) {
      lang = lang.substr(0, 2);
    }
  } else {
    lang = T9n.defaultLanguage;
  }
  return lang;
}

function setLanguage(){
  var lang = detectLanguage();
  Meteor.call('uiSetUserLanguage', lang, function(error, result) {
    //if (error) return console.log(error.reason);
  });
  return lang;
}

Template.changeLanguage.rendered = function() {
  var lang;
  if(Meteor.user() && Meteor.user().profile) {
    if (!Meteor.user().profile.settings || !Meteor.user().profile.settings.language) {
      lang = setLanguage();
          //T9n.defaultLanguage;
    } else {
      lang = Meteor.user().profile.settings.language;

      if (!lang){
        lang = setLanguage();
      }
    }
    T9n.setLanguage(lang);
    $('.dropdown-choose-lang').val(lang);
  }
};


Template.changeLanguage.events({
  'change .dropdown-choose-lang': function(e, v){
    var lang = e.target.value;
    
    if(!Meteor.user().profile.settings || Meteor.user().profile.settings.language !== lang) {
      T9n.setLanguage(lang);
      $('.dropdown-choose-lang').val(lang);
      Meteor.call('uiSetUserLanguage', lang, function(error, result) {
        //if (error) return console.log(error.reason);
      });
    }
  }
});



