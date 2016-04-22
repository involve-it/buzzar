/**
 * Created by xvolkx48 on 18.04.2016.
 */
Router.map(function () {
  this.route('tags', {
    path: '/tags',
    template: 'pageTags',
    layoutTemplate: 'mainLayoutHome',
    fastRender: true,
    data: function() {
      return {
        pageOptions: {
          logoType: '/img/logo/logo-home-logotype.png',
          logo: '/img/logo/logo-home.png',
          backgroundMobile: '/img/content/bg/mobile-home.jpg',
          backgroundDesktop:  '/img/content/bg/desktop-home.jpg'
        }
      }
    },
    onBeforeAction: function () {
      var qs = this.params.query;
      setPackageLanguage();
      this.next();
    },
    onAfterAction: function(){
     // bz.ui.putCategoriesToSession('trade');
    },
    onStop: function(){
      //bz.ui.putCategoriesToSession([]);
    }
  });
});
function setPackageLanguage(){
  var enAll = _.extend(bz.language.i18n.en, enI18n);
  T9n.map('en', enAll);
  var ruAll = _.extend(bz.language.i18n.ru, ruI18n);
  T9n.map('ru', ruAll);
}
