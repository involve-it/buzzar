/**
 * Created by arutu_000 on 12/22/2015.
 */

Meteor.startup(function () {
  GetUserLanguage().then((lang)=>{
    SetUiLanguage(lang);
  });
  Accounts.onLogin(function(user){
    //alert('login');
    GetUserLanguage().then((lang)=>{
      SetUiLanguage(lang);
  });
  });
});


SetUiLanguage = function(language){
  if(language) {
    T9n.setLanguage(language);
    Session.set('bz.user.language', language);
    _SaveUserLanguage(language);
  }
}

_SaveUserLanguage = function(language){
  if (language) {
    if (Meteor.user()) {
      if (!Meteor.user()._getLanguage() !== language) {
        Meteor.call('bz.user.setLanguage', language, function (error, result) {
          //if (error) return console.log(error.reason);
        });
      }
    } else {
      Cookie.set('bz.user.language', language);
    }
  }
}

GetUiLanguage = ()=> {
  return new Promise((resolve, reject) => {
    var sessLang = Session.get('bz.user.language');
    if(sessLang){
      resolve(sessLang);
    } else {
      GetUserLanguage().then((lang) => {
        resolve(lang);
      });
    }
  });
}

GetUserLanguage = function () {
  var langProm, detectedLang = detectClientLanguage();
  if (Meteor.user()) {
    langProm = new Promise((resolve, reject)=>{
      Meteor.call('bz.user.getLanguage', detectedLang, function (err, res) {
        //if (error) return console.log(error.reason);
        resolve(res);
      });
    });
  } else {
    langProm = new Promise((resolve, reject)=> {
      lang = Cookie.get('bz.user.language');
      resolve(lang);
    });
  }

  return langProm;
}

function detectClientLanguage() {
  var lang = window.navigator.userLanguage || window.navigator.language;
  //temporarily getting just first two letters of language (i.e. for en-US we'll take 'en' only).
  if (lang) {
    if (lang.length > 2) {
      lang = lang.substr(0, 2);
    }
  } else {
    lang = T9n.defaultLanguage;
  }
  return lang;
}
