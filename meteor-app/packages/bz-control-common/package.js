Package.describe({
  name: 'arutune:bz-control-common',
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
  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use(['templating', 'less'], 'client');
  //api.use(['natestrauser:filepicker-plus'], 'client');

  api.addFiles('bz-control-common.js');
  api.addFiles([
    'client/router.js',
    'client/model.js',
    'client/controller.js',
    'client/resources/t9-en.js'
  ], 'client');

  //api.addFiles([
  //    'controller.server.js'
  //  ], ['server']
  //);
  api.addFiles([
    'client/browser/category-list-buttons.html',
    'client/browser/category-list-buttons.js',
    'client/browser/category-list-buttons.less',

    'client/browser/main-menu.html',
    'client/browser/main-menu.js',
    'client/browser/main-menu.less',

    'client/browser/reviews.html',
    'client/browser/reviews.js',
    'client/browser/reviews.less',

    'client/browser/upload-image.html',
    'client/browser/upload-image.js',
    'client/browser/upload-image.less',

  ], 'web.browser');
  api.addFiles([
    'client/browser/category-list-buttons.html',
    'client/browser/category-list-buttons.js',
    'client/browser/category-list-buttons.less'
  ], 'web.cordova');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-control-common');
  api.addFiles('bz-control-common-tests.js');
});
