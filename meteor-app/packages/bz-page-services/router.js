/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  this.route('services', {
    path: '/services',
    template: 'pageServices',
    layoutTemplate: 'mainLayoutHome',
    fastRender: true,
    data: function() {
      return {
        pageOptions: {
          logoType: '/img/logo/logo-home-logotype.png',
          logo: '/img/logo/logo-services.png',
          backgroundMobile: '/img/content/bg/mobile-services.jpg',
          backgroundDesktop:  '/img/content/bg/desktop-services.jpg'
        }
      }
    },
    onBeforeAction: function () {
      var qs = this.params.query;
      //console.log(qs);
      //setSearchTextFromQs(qs);
      //setSearchLocationFromQs(qs);
      setPackageLanguage();
      this.next();
    },
    onAfterAction: function(){
      bz.ui.putCategoriesToSession('services');
    },
    onStop: function(){
      bz.ui.putCategoriesToSession([]);
    }
  });
});
function setPackageLanguage(){
  var enAll = _.extend(bz.language.i18n.en, enI18n);
  T9n.map('en', enAll);
  var ruAll = _.extend(bz.language.i18n.ru, ruI18n);
  T9n.map('ru', ruAll);
}

