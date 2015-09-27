Package.describe({
  name: 'arutune:bz-page-user',
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
  api.versionsFrom('1.1.0.3');

  api.use(['iron:router', 'iron:layout', 'aldeed:simple-schema'], ['client', 'server']);
  api.use(['templating', 'aldeed:autoform'], 'client');
  api.use('less', 'client');
  api.use('arutune:bz-main');

  api.addFiles([
    'client/router.js',
    'client/model.js',
    'client/controller.js'
  ], 'client');
  api.addFiles([
    'client/browser/common.html',
    'client/browser/common.js',

    'client/browser/profile.html',
    'client/browser/profile.js',

    'client/browser/user-settings.less',
    'client/browser/user-settings.html',
    'client/browser/user-settings.js',

    'client/browser/profile-edit.less',
    'client/browser/profile-edit.html',
    'client/browser/profile-edit.js',
  ], 'web.browser');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('arutune:bz-page-user');
  api.addFiles('bz-page-user-tests.js');
});
