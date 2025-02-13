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
  api.use(['iron:router', 'iron:layout', 'reactive-var', 'tracker', 'ecmascript'], ['client', 'server']);
  api.use(['check', 'thinksoftware:image-resize-client'], ['client', 'server']);// image upload for resizing

  api.use(['templating', 'less'], 'client');

  api.addFiles('bz-control-common.js');
  api.addFiles([
    'client/router.js',
    'client/model.js',
    'client/common.controller.js',
    'client/controller.upload-image.js',
    'client/resources/constants.js',
    'client/resources/t9-en.js'
  ], 'client');

  api.addFiles([
    'client/browser/around-you.html',
    'client/browser/around-you.js',
    'client/browser/around-you.less',
    'client/browser/around-you-small.html',
    'client/browser/around-you-small.js',
    'client/browser/around-you-small.less',
    'client/browser/new-posts.html',
    'client/browser/new-posts.js',

    'client/browser/category-list-buttons.html',
    'client/browser/category-list-buttons.js',
    'client/browser/category-list-buttons.less',

    'client/browser/main-menu.html',
    'client/browser/main-menu.js',
    'client/browser/main-menu.less',

    'client/browser/reviews.html',
    'client/browser/reviews.js',
    'client/browser/reviews.less',

    'client/browser/ui-spinner.js',
    'client/browser/ui-spinner.less',

    'client/browser/upload-image.html',
    'client/browser/upload-image.js',
    'client/browser/upload-image.less',
    'client/browser/users.html',
    'client/browser/users.js'

  ], global.bzSettings.webBrowserArray);
  api.addFiles([
    'client/ionic/side-menu/vendor/classie.js',
    'client/ionic/side-menu/vendor/snap.svg-min.js',

    'client/ionic/side-menu/toggleMenuRight.html',
    'client/ionic/side-menu/toggleMenuLeft.html',
    'client/ionic/side-menu/menu.html',
    'client/ionic/side-menu/menu.js',
    'client/ionic/side-menu/menu.less',

    'client/ionic/category-list-buttons.html',
    'client/ionic/category-list-buttons.js',
    'client/ionic/category-list-buttons.less',
  ], global.bzSettings.webCordovaArray);
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-control-common');
  api.addFiles('bz-control-common-tests.js');
});
