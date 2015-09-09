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
  api.versionsFrom('1.1.0.3');

  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use('templating', 'client');
  api.use('less', 'client');

  api.use('arutune:bz-main');
  api.use('arutune:bz-control-honeycomb');

  //Web only files
  api.addFiles([
    'browser/router.js',
    //'web/style.css',
    //'web/home.html',
    'browser/ui/page-home.html',
    'browser/ui/page-home.js',
  ], 'web.browser');


  //Cordova only files
  api.addFiles([
    'cordova/router.js',
    'cordova/ui/page-home.html',
    'cordova/ui/page-home.js',
  ], 'web.cordova');
});
Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-page-home');
  api.addFiles('tests/bz-page-home.js');
});
