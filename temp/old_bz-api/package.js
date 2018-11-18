// sets global, to have an can-be-used-in-all-packages globals for browser/cordova packages compilation:
setPackagesCompilationGlobals();

Package.describe({
  name: 'aarutune:bz-api',
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

  // api.use(['anti:i18n', 'softwarerero:accounts-t9n'], ['client', 'server']);
  api.use(['iron:router', 'iron:layout', 'selaias-local:accounts-entry', 'ecmascript'], global.bzSettings.webBrowserArrayWithServer);
  api.use('service-configuration', ['server']);


  api.use(['underscore', 'session']);
  // api.use(['templating'], global.bzSettings.webBrowserArray);


  api.addFiles([
    'server/lib/config.js',
    'server/lib/accounts.js'
  ], 'server');



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
