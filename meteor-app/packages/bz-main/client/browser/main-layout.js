/**
 * Created by douson on 06.07.15.
 */
bz.help.maps.initLocation();

Template.mainLayout.created = function () {
}

Template.mainLayout.rendered = function () {

  InitFoundationOffCanvas();
  layoutRenderedLazyLoad();

};

Template.mainLayoutHome.rendered = function () {

  InitFoundationOffCanvas();
  layoutRenderedLazyLoad();

};

Template.changeLanguage.rendered = function () {
  var langProm;
  /*if(Meteor.user() && Meteor.user().profile) {
   if (!Meteor.user().profile.settings || !Meteor.user().profile.settings.language) {
   lang = SetUserLanguage();
   //T9n.defaultLanguage;
   } else {
   lang = Meteor.user().profile.settings.language;

   if (!lang){
   lang = SetUserLanguage();
   }
   }
   T9n. SetUserLanguage(lang);*/

  GetUiLanguage().then((lang)=> {
    $('.dropdown-choose-lang').val(lang);
  });
};


Template.changeLanguage.events({
  'change .dropdown-choose-lang': function (e, v) {
    var lang = e.target.value;
    $('.dropdown-choose-lang').val(lang);

    SetUiLanguage(lang);
  }
});

Meteor.startup(()=>{
  Tracker.autorun(()=>{
    var sessLang = Session.get('bz.user.language');
    if(sessLang) {
      $('.dropdown-choose-lang').val(lang);
    }
  });
});

