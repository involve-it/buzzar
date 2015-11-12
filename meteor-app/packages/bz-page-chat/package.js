Package.describe({
  name: 'arutune:bz-page-chat',
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
  //api.versionsFrom('1.1.0.3');

  api.use('iron:router', ['client', 'server']);
  api.use('iron:layout', ['client', 'server']);
  api.use('templating', 'client');
  api.use('less', 'client');
  //api.use('alethes:pages');
  api.use('arutune:bz-main');
  api.addFiles([
    'client/router.js',
    'client/controller.js',
    'client/page-chats.less'
  ], 'client');

  api.addFiles([
    'client/browser/chat-id.less',
    'client/browser/chat-id.html',
    'client/browser/chat-id.js',
    'client/browser/chats-all.html',
    'client/browser/chats-all.js',
    'client/browser/controls.html',
    'client/browser/controls.js',
    'client/browser/page-chats.less',
    'client/browser/page-chats.html',
    'client/browser/page-chats.js'
  ], global.bzSettings.webBrowserArray);

  api.addFiles([
  ], global.bzSettings.webCordovaArray);
});
Package.onTest(function (api) {
  api.use('tinytest');
  api.use('bz-page-chat');
  api.addFiles('bz-page-chat-tests.js');
});
