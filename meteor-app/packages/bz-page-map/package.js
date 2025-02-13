Package.describe({
  name: 'arutune:bz-page-map',
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
  //api.versionsFrom('1.1.0.3');
  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use('templating', 'client');
  api.use('less', 'client');
  //api.use('alethes:pages');
  api.use('arutune:bz-main');

  api.addFiles([
    'client/package-map.less',
    'client/router.js',
    'client/controller.js'
  ], 'client');

  api.addFiles([
    'client/browser/google-map.less',
    'client/browser/google-map.html',
    'client/browser/google-map.js',

    'client/browser/page-map.less',
    'client/browser/page-map.html',
    'client/browser/page-map.js',
  ], global.bzSettings.webBrowserArray);

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('arutune:bz-page-map');
  api.addFiles('bz-page-map-tests.js');
});
