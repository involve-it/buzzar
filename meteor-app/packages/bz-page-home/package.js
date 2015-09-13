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


  api.use('sacha:spin');

  api.use('arutune:bz-main');
  api.use('arutune:bz-control-search');
  api.use('arutune:bz-control-honeycomb');

  api.addFiles([
    'client/router.js',
    'client/checkin-btn.less',
    'client/checkin-btn.html',
    'client/checkin-btn.js'
  ], 'client');
  api.addFiles([
    'client/browser/app-loading.html',
    'client/browser/page-home.html',
    'client/browser/page-home.js',
    'client/browser/page-home.less'
  ], 'web.browser');
  api.addFiles([
    'client/cordova/page-home.html',
    'client/cordova/page-home.js',
  ], 'web.cordova');
});
Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-page-home');
  api.addFiles('tests/bz-page-home.js');
});
