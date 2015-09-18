Package.describe({
  name: 'arutune:bz-page-landing',
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
  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use('templating', 'client');
  //api.use('less', 'client');
  //api.use('arutune:bz-main');
  api.addFiles([
    'client/router.js'
  ], 'client');
  api.addFiles([
    'client/browser/about-us.html',
    'client/browser/page-about-us.html',

  ], 'web.browser');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('arutune:bz-page-landing');
  api.addFiles('bz-page-landing-tests.js');
});
