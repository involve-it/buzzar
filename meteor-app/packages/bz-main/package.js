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
  api.versionsFrom('1.1.0.3');

  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use(['templating', 'less'], 'client');
  //api.use('juliancwirko:zf5', ['web.browser']);
  api.use('fourseven:scss');
  api.use('arutune:bz-api');

  api.use([
    'meteoric:ionic',
    'meteoric:ionic-sass',
    'meteoric:ionicons-sass',
    'meteoric:autoform-ionic',
  ], 'web.cordova');


  api.addFiles([
    'client/browser/style/foundation-main.scss',
    'client/browser/main-layout.html',
    'client/browser/main-layout.js',
    'client/browser/main-layout.less',
    'client/browser/views/category-list-buttons.less',
    'client/browser/views/category-list-buttons.html',
    'client/browser/views/category-list-buttons.js',
  ], 'web.browser');
  api.addFiles([
    'client/cordova/main-layout.html',
    'client/cordova/main-layout.js',
    'client/cordova/main-layout.less',
    'client/cordova/style/app-ionic.less',
    'client/cordova/main-layout.less',
    'client/cordova/style/app.scss'
  ], 'web.cordova');

  api.addFiles([
    'client/about-us.html'
  ], 'web');

});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-main');
  api.addFiles('bz-main-tests.js');
});
