Package.describe({
  name: 'arutune:bz-integrations-telegram',
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

  api.use(['underscore', 'iron:router', 'iron:layout', 'mongo', 'reactive-var', 'tracker', 'ecmascript', 'dburles:collection-helpers',
    'benjick:telegram-bot', 'arutune:bz-data'
  ], ['client', 'server']);

  api.use(['templating', 'less'], 'client');
  api.addFiles(['server/main.js', 'server/telebot.js'], 'server');

  api.addFiles(['data/collection.js'], ['client', 'server']);

  api.addFiles([
    'client/i18n/english.js',
    'client/i18n/russian.js',
    'client/telegram.controller.js',
  ], 'client');
});

