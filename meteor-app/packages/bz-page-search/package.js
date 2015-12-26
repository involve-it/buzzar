Package.describe({
  name: 'arutune:bz-page-search',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  //api.versionsFrom('1.1.0.3');

  api.use(['iron:router', 'iron:layout', 'accounts-base', 'service-configuration', 'oauth1', 'ecmascript'], ['client', 'server']);
  api.use(['templating', 'http'], 'client');
  api.use('less', 'client');
  //api.use('ssing128:yelp-meteor', 'client');
  api.use('arutune:bz-main');
  api.use(['dburles:collection-helpers', 'arutune:bz-control-common'], 'client');

  api.addFiles([
    //'server/yelp.js',
    'server/model.js'
  ], 'server');
  api.addFiles([
    'client/router.js',
    'client/model.js',
    'client/controller.js',
    //'resources/t9-en.js'
  ], 'client');

  api.addFiles([
    'style/search.less',

    'client/browser/location/choose-location.html',
    'client/browser/location/choose-location.js',
    'client/browser/location/choose-location.less',
    //'client/browser/page-search-results.html',
    //'client/browser/page-search-results.js',
    'client/browser/search-location.html',
    'client/browser/search-location.js',
    'client/browser/search-location.less',

    'client/browser/search-results.html',
    'client/browser/search-results.js',
    'client/browser/search.html',
    'client/browser/search.js',

  ], global.bzSettings.webBrowserArray);
  api.addFiles([
  ], global.bzSettings.webCordovaArray);
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-page-search');
  api.addFiles('bz-control-search-tests.js');
});
