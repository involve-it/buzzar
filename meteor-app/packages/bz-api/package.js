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

  api.use(['anti:i18n', 'softwarerero:accounts-t9n'], ['client', 'server']);
  api.use(['iron:router', 'iron:layout', 'selaias-local:accounts-entry', 'ecmascript'], global.bzSettings.webBrowserArrayWithServer);
  api.use('service-configuration', ['server']);

  //api.use('iron:layout', ['client', 'server']);
  api.use(['underscore', 'session']);
  api.use(['templating'], global.bzSettings.webBrowserArray);

  // load all server/client/shared lib files:
  api.addFiles([
    'shared/lib/01_inits/01_init.js',
    'shared/lib/01_inits/02_helpers.js',
    'shared/lib/01_inits/03_extends.js',
    'shared/lib/02_business/posts.js',
    'shared/lib/02_business/location.js'
  ]);
  api.addFiles([
    'server/lib/config.js',
    'server/lib/accounts.js'
  ], 'server');

  /*UI kit fonts*/
  api.addAssets([
    'client/lib/vendor/uikit/fonts/FontAwesome.otf',
    'client/lib/vendor/uikit/fonts/fontawesome-webfont.ttf',
    'client/lib/vendor/uikit/fonts/fontawesome-webfont.woff',
    'client/lib/vendor/uikit/fonts/fontawesome-webfont.woff2'
  ], 'client');
  
  api.addFiles([
    'client/lib/vendor/toast.js',
    '/client/lib/01_inits/version-start.js',

    'client/lib/01_inits/accounts.js',
    'client/lib/01_inits/bz-js.js',
    'client/lib/01_inits/bz-ui.js',
    'client/lib/01_inits/location.js',
    'client/lib/01_inits/fb.js',
    'client/lib/01_inits/maps.js',
    'client/lib/01_inits/template-helpers.js',
    'client/lib/rates/jquery.raty.js',
    'client/lib/animate/animate.css',

    'client/lib/rates/jquery.raty.css',
    'client/lib/01_inits/mobile.js'
  ], 'client');

  api.addFiles([
   'client/lib/vendor/uikit/css/uikit.css',
   'client/lib/vendor/uikit/css/components/slider.css',
   'client/lib/vendor/uikit/js/uikit.js',
   'client/lib/vendor/uikit/js/components/slider.js'
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
      webBrowserArrayWithServer: [],
      webCordovaArray : ['web.browser', 'web.cordova'],
      webCordovaArrayWithServer : ['web.browser', 'web.cordova', 'server']
    }
  } else {
    // browser developer:
    global.bzSettings = {
      webBrowserArray: ['web.browser', 'web.cordova'],
      webBrowserArrayWithServer: ['web.browser', 'web.cordova', 'server'],
      webCordovaArray: [],
      //webCordovaArray : ['web.cordova']
    }
  }
}