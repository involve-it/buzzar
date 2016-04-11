Package.describe({
  name: 'arutune:bz-main',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Main entry loader for the app',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  //api.versionsFrom('1.1.0.3');

  api.use(['ecmascript'], global.bzSettings.webBrowserArrayWithServer);
  api.use(['iron:router', 'iron:layout', 'less', 'sergeyt:typeahead', 'anti:i18n'], 'client'); // todo: replace typeahead with required file
  api.use(['templating'], global.bzSettings.webBrowserArray);
  api.use(['fourseven:scss@3.2.0', 'edgee:slingshot']);
  //api.use(['zeroasterisk:meteor-cordova-geolocation-background'], 'web.cordova'); // had to add it to the main project (meteor add zeroasterisk:cordova-geolocation-background)
  api.use(['arutune:bz-api', 'arutune:bz-control-common']);
  api.use([
   /* 'meteoric:ionic',
    'meteoric:ionic-sass',
    'meteoric:ionicons-sass',
    'meteoric:autoform-ionic',
    'fortawesome:fontawesome'*/
      
    /* -> turned off ionic style on the 82 line*/  
      
    'angular-with-blaze',
    'driftyco:ionic'
  ], global.bzSettings.webCordovaArray);
  //api.use([ 'cordova:com.ionic.keyboard', 'cordova:org.apache.cordova.device' ], 'web.cordova');// @Slava: do we need this?
  api.addFiles([
      'controller.server.js'
    ], ['server']
  );

  api.addFiles([
    'client/main.less',
    'client/controller.js',
    'client/language.js',
    'client/router.js',
    'client/app-loading.html',
    'client/i18n/english.js',
    'client/i18n/russian.js'
  ], 'client');
  api.addFiles([
    'client/browser/style/foundation/js/vendor/modernizr.js',
    'client/browser/style/foundation/js/foundation.js',
    'client/browser/style/foundation/js/foundation-select.js',
    'client/browser/style/foundation/js/foundation/foundation.clearing.js',
    'client/browser/style/foundation/js/foundation/foundation.tooltip.js',
	  'client/browser/style/foundation/js/foundation/foundation.dropdown.js',
    'client/browser/style/foundation/js/foundation/foundation.tab.js',
    'client/browser/style/foundation/js/foundation/foundation.offcanvas.js',
    'client/browser/style/foundation/js/foundation/foundation.abide.js',
    'client/browser/style/foundation/js/foundation/foundation.slider.js'
  ], global.bzSettings.webBrowserArray);
  api.addFiles([
    'client/browser/style/foundation/foundation-select.css',
    'client/browser/style/foundation-main.scss',
    'client/browser/style/foundation-custom-settings.scss',
    'client/browser/style/_buttons.scss',
    
    //Drop style  
    'client/browser/style/drop-theme-arrows-bounce.less',
      
    //Date picker
    //'client/browser/style/foundation/js/locales-datapicker/foundation-datepicker.en-GB.js',
    //'client/browser/style/foundation/js/locales-datapicker/foundation-datepicker.ru.js',
    'client/browser/style/foundation/js/foundation-datepicker.js', 
    'client/browser/style/foundation-datepicker.css', 

    //Inits foundationValidation
    'client/inits.js',
    'client/browser/controller.js',
      
    'client/browser/main-layout.html',
    'client/browser/main-layout.js',
    'client/browser/main-layout.less'
  ], global.bzSettings.webBrowserArray);

  
  
  /*api.addAssets([
  
    'client/ionic/main-layout.html',
    'client/ionic/main-layout.js',
    'client/ionic/main-layout.less',
    'client/ionic/style/app-ionic.less',
    'client/ionic/style/app.scss'
  ], global.bzSettings.webCordovaArray);*/
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-main');
  api.addFiles('bz-main-tests.js');
});
