Package.describe({
  name: 'arutune:bz-control-search',
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

  api.use(['templating', 'less'], 'client');

  api.addFiles([
    'client/search.html',
    'client/search.js',
  ], 'client');

  api.addFiles('bz-control-search.js');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('arutune:bz-control-search');
  api.addFiles('bz-control-search-tests.js');
});
