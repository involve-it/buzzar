Package.describe({
  name: 'arutune:bz-page-home',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Home page of app',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  //api.versionsFrom('1.1.0.3');

  api.use(['iron:router', 'iron:layout', 'ecmascript', 'underscore'], ['client', 'server']);

  api.use('templating', 'client');
  api.use('less', 'client');

  
  api.use('sacha:spin');
  api.use(['arutune:bz-main', 'arutune:bz-page-search', 'arutune:bz-page-chat']);
  api.addFiles([
    'client/router.js'
  ]);
  api.addFiles([
    //'client/router.js',
    'client/controller.js',
    'client/i18n/english.js',
    'client/i18n/russian.js'
  ], 'web');

  api.addFiles([
    'client/browser/popular.html',
    'client/browser/popular.js',
    'client/browser/popular.less',
    'client/browser/page-home.html',
    'client/browser/page-home.js',
    'client/browser/page-home.less',
    
    'client/browser/landing-pages/home-landing-page-unregistered.html',
    'client/browser/landing-pages/home-landing-page-unregistered.js',
    'client/browser/landing-pages/home-landing-page-unregistered.less'
  ], global.bzSettings.webBrowserArray);

  api.addFiles([
    'client/ionic/around-you.html',
    'client/ionic/around-you.js',
    'client/ionic/around-you.less',
    'client/ionic/page-home.html',
    'client/ionic/page-home.js'
  ], global.bzSettings.webCordovaArray);
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-page-home');
  api.addFiles('tests/bz-page-home.js');
});
