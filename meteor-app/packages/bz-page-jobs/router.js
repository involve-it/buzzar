/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  this.route('jobs', {
    path: '/jobs',
    template: 'pageJobs',
    layoutTemplate: 'mainLayoutHome',
    fastRender: true,
    data: function() {
      var path = this.route.path();
      console.log(path);
      return {
        pageOptions: {
          logoType: '/img/logo/logo-home-logotype.png',
          logo: '/img/logo/logo-jobs.png',
          backgroundMobile: '/img/content/bg/state-city.jpg',
          backgroundDesktop:  '/img/content/bg/desktop-jobs.jpg'
        }
      }
    },
    onBeforeAction: function () {
      //var qs = this.params.query;
      //console.log(qs);
      //setSearchTextFromQs(qs);
      //setSearchLocationFromQs(qs);
      setPackageLanguage();
      this.next();
    },
    onAfterAction: function(){
      /*debugger;*/
      bz.ui.putCategoriesToSession('jobs');
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

