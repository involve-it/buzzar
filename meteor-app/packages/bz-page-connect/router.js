/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  this.route('connect', {
    path: '/connect',
    template: 'pageConnect',
    layoutTemplate: 'mainLayoutHome',
    fastRender: true,
    data: function() {
      return {
        pageOptions: {
          backgroundMobile: '/img/content/bg/state-city.jpg',
          backgroundDesktop:  '/img/content/bg/fly-balls.jpg'
        }
      }
    },
    onBeforeAction: function () {
      var qs = this.params.query;
      console.log(qs);
      //setSearchTextFromQs(qs);
      //setSearchLocationFromQs(qs);
      setPackageLanguage();
      this.next();
    },
    onAfterAction: function(){
      bz.ui.putCategoriesToSession('connect');
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

