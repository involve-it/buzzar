/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  this.route('home', {
    path: '/home',
    template: 'pageHome',
    layoutTemplate: 'mainLayoutHome',
    controller: 'baseController',
    //fastRender: true,
    waitOn: function () {
      return [
        // temp solution
        Meteor.subscribe('posts-all'),
        Meteor.subscribe('posts-images')
      ]
    },
    data: function() {
      var path = this.route.path();
      return {
        pageOptions: {
          logoType: '/img/logo/logo-home-logotype.png',
          logo: '/img/logo/logo-home.png',
          backgroundMobile: '/img/content/bg/mobile-home.jpg',
          backgroundDesktop:  'https://buzzar.s3-us-west-1.amazonaws.com/v1.0/public/images/1468976184271-b2e1af31-0b3a-c704-461d-42bd6320a36a.png'
          // backgroundDesktop:  '/img/content/bg/desktop-home.jpg'
        }
      }
    },
    onBeforeAction: function () {
      var qs = this.params.query;
      //console.log(qs);
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
