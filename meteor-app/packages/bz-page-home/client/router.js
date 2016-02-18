/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  this.route('home', {
    path: '/home',
    template: 'pageHome',
    layoutTemplate: 'mainLayoutHome',
    controller: 'requireLoginController',
    //fastRender: true,
    data: function() {
      var path = this.route.path();
      console.log(path);
      return {
        pageOptions: {
          backgroundMobile: '/img/content/bg/state-city.jpg',
          backgroundDesktop:  '/img/content/bg/fly-balls.jpg'
        }
      }
    },
    onBeforeAction: function () {
      //debugger;
      var qs = this.params.query;
      console.log(qs);
      setSearchTextFromQs(qs);
      setSearchLocationFromQs(qs);
      setPackageLanguage();
      this.next();
    }
  });
  
});


function setPackageLanguage(){
  var enAll = _.extend(bz.language.i18n.en, enI18n);
  T9n.map('en', enAll);
  var ruAll = _.extend(bz.language.i18n.ru, ruI18n);
  T9n.map('ru', ruAll);
}
