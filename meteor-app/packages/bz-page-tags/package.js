/**
 * Created by xvolkx48 on 18.04.2016.
 */
Package.describe({
  name: 'arutune:bz-page-tags',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['iron:router', 'iron:layout', 'ecmascript', 'underscore'], ['client', 'server']);

  api.use('templating', 'client');
  api.use('less', 'client');

  api.use(['arutune:bz-main', 'arutune:bz-page-search', 'arutune:bz-page-chat']);

  api.addFiles([
    'router.js'
  ]);
  api.addFiles([
    //'client/router.js',
    //'client/controller.js'
  ], 'web');

  api.addFiles([
    'client/i18n/english.js',
    'client/i18n/russian.js',
    'client/browser/page-tags.html',
    'client/browser/page-tags.js',
    'client/browser/page-tags-controls.html',
    'client/browser/page-tags-controls.js'
    //'client/browser/page-tags.less'
  ], global.bzSettings.webBrowserArray);

  api.addFiles([
  ], global.bzSettings.webCordovaArray);
});