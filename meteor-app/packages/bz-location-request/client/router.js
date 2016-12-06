
Router.map(function () {
  this.route('shareLocation', {
    path: '/share-location',
    template: 'shareLocation',
    layoutTemplate: 'mainLayoutHome',
    // fastRender: true,
    data: function() {
      return [
      ]
    },
    onBeforeAction: function () {
      var qs = this.params.query;
      //console.log(qs);
      //setSearchTextFromQs(qs);
      //setSearchLocationFromQs(qs);
      // setPackageLanguage();
      this.next();
    },
    onAfterAction: function(){
      // bz.ui.putCategoriesToSession('help');
    },
    onStop: function(){
      // bz.ui.putCategoriesToSession([]);
    }
  });
  this.route('viewLocation', {
    path: '/view-location',
    template: 'viewLocation',
    layoutTemplate: 'mainLayoutHome',
    // fastRender: true,
    data: function() {
      return [
      ]
    },
    onBeforeAction: function () {
      var qs = this.params.query;
      //console.log(qs);
      //setSearchTextFromQs(qs);
      //setSearchLocationFromQs(qs);
      // setPackageLanguage();
      this.next();
    },
    onAfterAction: function(){
      // bz.ui.putCategoriesToSession('help');
    },
    onStop: function(){
      // bz.ui.putCategoriesToSession([]);
    }
  });
  this.route('requestLocation', {
    path: '/request-location',
    template: 'requestLocation',
    layoutTemplate: 'mainLayoutHome',
    controller: 'requireLoginController',
    // fastRender: true,
    data: function() {
      return [
      ]
    },
    onBeforeAction: function () {
      var qs = this.params.query;
      //console.log(qs);
      //setSearchTextFromQs(qs);
      //setSearchLocationFromQs(qs);
      // setPackageLanguage();
      this.next();
    },
    onAfterAction: function(){
      // bz.ui.putCategoriesToSession('help');
    },
    onStop: function(){
      // bz.ui.putCategoriesToSession([]);
    }
  });
});
/*
function setPackageLanguage(){
  var enAll = _.extend(bz.language.i18n.en, enI18n);
  T9n.map('en', enAll);
  var ruAll = _.extend(bz.language.i18n.ru, ruI18n);
  T9n.map('ru', ruAll);
}
*/
