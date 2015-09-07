Package.describe({
  name: 'arutune:bz-web',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'This package files needed ONLY in browser.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('templating','client');
  api.use('arutune:bz-api');

  api.addFiles([
    'ui/main-layout.html',
    'ui/main-layout.js',
    'ui/main-layout.less'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('arutune:bz-web');
  api.addFiles('bz-web-tests.js');

});
