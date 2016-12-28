// sets global, to have an can-be-used-in-all-packages globals for browser/cordova packages compilation:
Package.describe({
  name: 'arutune:bz-data',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Core data functionality',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.use(['mongo', 'arutune:bz-api'], ['server', 'client']);
  api.use(['ecmascript'], global.bzSettings.webBrowserArrayWithServer);

  api.use(['underscore', 'session']);
  api.use(['templating'], global.bzSettings.webBrowserArray);

  // load all server/client/shared lib files:
  api.addFiles([
    'shared/posts.js',
    'server/posts.js'
  ]);
});