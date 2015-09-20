Package.describe({
  name: 'arutune:bz-control-honeycomb',
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
  api.versionsFrom('1.1.0.3');

  api.use(['templating', 'less'], 'client');
  api.use('angular', 'client');
  api.addFiles([
    //'lib/angular.js',
    'web.client/app.js',
    'user.ng.html',

    'web.client/honeycomb.less',
    'web.client/honeycomb.html',
    'web.client/honeycomb.js',
    //'web.client/index.ng.html',
  ], 'client');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('bz-control-honeycomb');
  api.addFiles('bz-control-honeycomb-tests.js');
});
