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
  api.versionsFrom('1.1.0.3');

  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use('templating', 'client');
  api.use('less', 'client');
  api.use('arutune:bz-main');
  api.use(['arutune:bz-control-common'], 'client');

  api.addFiles([
    'client/router.js',
    'client/model.js',
    'client/controller.js',
    'resources/t9-en.js'
  ], 'client');
  api.addFiles([
    'style/search.less',

    //'client/browser/page-search-results.html',
    //'client/browser/page-search-results.js',
    'client/browser/search-results.html',
    'client/browser/search-results.js',
    'client/browser/search.html',
    'client/browser/search.js',
  ], 'web.browser');

});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-page-search');
  api.addFiles('bz-control-search-tests.js');
});
