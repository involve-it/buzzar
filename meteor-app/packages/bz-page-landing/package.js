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
  //api.versionsFrom('1.1.0.3');
  api.use(['iron:router', 'iron:layout', 'underscore', 'arutune:bz-main'], ['client', 'server']);
  api.use('templating', global.bzSettings.webBrowserArray);

  api.addFiles([
    'client/router.js',
    'client/i18n/english.js',
    'client/i18n/russian.js'
  ], 'web');

  api.addFiles([
    'client/browser/about-us.html',
    'client/browser/page-not-found.html',
    'client/browser/page-about-us.html',
    'client/browser/page-contact-us.html',
    'client/browser/page-contact-us.js',
    'client/browser/page-admin-tags.html',
    'client/browser/page-admin-tags.js'
  ], global.bzSettings.webBrowserArray);

  api.use([
    'angular-with-blaze',
    'driftyco:ionic'
  ], global.bzSettings.webCordovaArray);

  api.addFiles([
    'client/ionic/about-us.html',
     /*'client/ionic/page-not-found.html',
    'client/ionic/page-about-us.html',
    'client/ionic/page-contact-us.html',
    'client/ionic/page-contact-us.js',*/
  ], global.bzSettings.webCordovaArray);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('arutune:bz-page-landing');
  api.addFiles('bz-page-landing-tests.js');
});
