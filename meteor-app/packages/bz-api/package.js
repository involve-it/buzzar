// sets global, to have an can-be-used-in-all-packages globals for browser/cordova packages compilation:
setPackagesCompilationGlobals();

Package.describe({
  name: 'arutune:bz-api',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Inits, helpers, configs, extends etc.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  //api.versionsFrom('1.1.0.3');

  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use('service-configuration', ['server']);
  //api.use('iron:layout', ['client', 'server']);
  api.use(['underscore', 'session']);
  api.use(['templating'], 'client');

  // load all server/client/shared lib files:
  api.addFiles([
    'shared/lib/01_inits/01_init.js',
    'shared/lib/01_inits/02_helpers.js',
    'shared/lib/01_inits/03_extends.js',
    'shared/lib/02_business/posts.js',
    'shared/lib/02_business/location.js'
  ]);
  api.addFiles([
    'server/lib/config.js'
  ], 'server');
  api.addFiles([
    'client/lib/01_inits/accounts.js',
    'client/lib/01_inits/location.js',
    'client/lib/01_inits/fb.js',
    'client/lib/01_inits/maps.js',
    'client/lib/01_inits/t9.js',
    'client/lib/01_inits/template-helpers.js',
    'client/lib/rates/jquery.raty.js',
    'client/lib/animate/animate.css',

    'client/lib/rates/jquery.raty.css'
  ], 'client');
  /*api.addAssets([
    'client/lib/rates/fonts/wbotelhos.eot',
    'client/lib/rates/fonts/wbotelhos.svg',
    'client/lib/rates/fonts/wbotelhos.ttf',
    'client/lib/rates/fonts/wbotelhos.woff'
  ], 'client');*/
});

Package.onTest(function (api) {
  //api.use('tinytest');  // use in-built tinytets
  api.use('sanjo:jasmine');
  api.use('arutune:bz-api');
  api.addFiles('bz-main-tests.js', ['client']);
});

// HELPERS:
function setPackagesCompilationGlobals (mob){
  if (mob) {
    // mobile developer:
    global.bzSettings = {
      webBrowserArray: [],
      webCordovaArray : ['web.browser', 'web.cordova']
    }
  } else {
    // browser developer:
    global.bzSettings = {
      webBrowserArray: ['web.browser'],
      //webBrowserArray: ['web.browser', 'web.cordova'],
      webCordovaArray : ['web.cordova']
    }
  }
}