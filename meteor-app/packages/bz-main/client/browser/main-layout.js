/**
 * Created by douson on 06.07.15.
 */
bz.help.maps.initLocation();

Meteor.startup(function() {
  $('body').attr('data-uk-observe', '1');
});

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

Template.bzChangeLanguage.rendered = function () {
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
    $('.js-language-picker').val(lang || 'en');

    //Ashot: review - select language drop down was not updating on jQuery call.
    //_.defer seems to fix it, although not sure if it's the right approach.
    /*_.defer(function(){
      $('.js-language-picker').val(lang);
    });*/
  });
};


Template.bzChangeLanguage.events({
  //'change .dropdown-choose-lang': function (e, v) {
  'change .js-language-picker': function (e, v) {
    var lang = e.target.value;
    //$('.js-language-picker').val(lang);

    SetUiLanguage(lang);
    setTimeout(()=>{
      $('.js-bz-header').hide().show(0);
    }, 100);
  }
});

Meteor.startup(()=>{
  Tracker.autorun(()=>{
    var sessLang = Session.get('bz.user.language');
    if(sessLang) {
      //$('.dropdown-choose-lang').val(lang);
    }
  });
});


Template.bzDropSelectLanguage.rendered = function() {
  
  GetUiLanguage().then((lang)=> {

    var el = $('.bz-switcher-language-list'),
        element = el.children().find('a');
    
    element.each(function() {
      if($(this).data('lang') === lang) {
        $(this).addClass('active');
      }
    });
    
    /*OLD V.*/ 
    /*var el = $('.drop-language');
    el.children().not('.'+lang).addClass('hide');*/
 
  });

};

Template.bzDropSelectLanguage.events({
  'click [data-lang]': function(e, v) {
    e.preventDefault();
    
    var lang = e.target.getAttribute('data-lang');
    SetUiLanguage(lang);
    
    var el = $('.bz-switcher-language-list');
            
    var toggles = el.find('>*'),
        target = $(e.target);
    
    if(target.hasClass('active')) {
      return;
    }else {
      toggles.find('a').filter(".active").removeClass("active");
      target.addClass("active");
    }
        
    /*OLD V.*/
    /*var el = $('.drop-language');
    el.children('.'+lang).removeClass('hide');
    el.children().not('.'+lang).addClass('hide');*/
  }
});




