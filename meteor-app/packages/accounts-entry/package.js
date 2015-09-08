Package.describe({
    summary: "Make signin and signout their own pages with routes.",
    version: '1.0.3',
    name: "joshowens:accounts-entry",
    githubUrl: 'https://github.com/Differential/accounts-entry',
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@0.9.0");

  api.use(['iron:router@1.0.3', 'softwarerero:accounts-t9n@1.0.3', 'joshowens:simple-form@0.2.2', 'sacha:spin@2.0.4'], ['client', 'server']);
  // CLIENT
  api.use([
    'deps',
    'service-configuration',
    'accounts-base',
    'underscore',
    'templating',
    'handlebars',
    'session',
    'coffeescript',
    'less',
    'sha']
  , 'client');
  // SERVER
  api.use([
    'deps',
    'service-configuration',
    'accounts-password',
    'accounts-base',
    'underscore',
    'coffeescript'
  ], 'server');


  api.addFiles([
    'client/entry.less',
    'client/views/signIn/signIn.html',
    'client/views/signUp/signUp.html',
    'client/views/signUp/extraSignUpFields.html',
    'client/views/forgotPassword/forgotPassword.html',
    'client/views/resetPassword/resetPassword.html',
    'client/views/enrollAccount/enrollAccount.html',

  ], 'web.browser');
  api.addFiles([
    'client/entry.less',
    'client/views/signIn/signIn.app.html',
    'client/views/signUp/signUp.app.html',
    'client/views/signUp/extraSignUpFields.app.html',
    'client/views/forgotPassword/forgotPassword.app.html',
    'client/views/resetPassword/resetPassword.app.html',
    'client/views/enrollAccount/enrollAccount.app.html',

  ], 'web.cordova');

  api.addFiles([
    'client/views/social/social.html',
    'client/views/error/error.html',
    'client/views/accountButtons/accountButtons.html',
    'client/views/accountButtons/_wrapLinks.html',
    'client/views/accountButtons/signedIn.html',
    'client/views/verificationPending/verificationPending.html',

    'client/entry.coffee',
    'client/helpers.coffee',
    'client/views/signIn/signIn.coffee',
    'client/views/signUp/signUp.coffee',
    'client/views/signUp/extraSignUpFields.coffee',
    'client/views/forgotPassword/forgotPassword.coffee',
    'client/views/resetPassword/resetPassword.coffee',
    'client/views/enrollAccount/enrollAccount.coffee',
    'client/views/social/social.coffee',
    'client/views/error/error.coffee',
    'client/views/accountButtons/accountButtons.coffee',
    'client/views/verificationPending/verificationPending.coffee',
    'client/t9n/english.coffee',
    'client/t9n/french.coffee',
    'client/t9n/german.coffee',
    'client/t9n/italian.coffee',
    'client/t9n/polish.coffee',
    'client/t9n/spanish.coffee',
    'client/t9n/swedish.coffee',
    'client/t9n/portuguese.coffee',
    'client/t9n/slovene.coffee',
    'client/t9n/russian.coffee',
    'client/t9n/arabic.coffee',
    'client/t9n/hebrew.coffee',

  ], 'client');

  api.addFiles(['server/entry.coffee'], 'server');

  // CLIENT and SERVER
  api.imply('accounts-base', ['client', 'server']);
  api.imply('accounts-password', ['client', 'server']);
  api.export('AccountsEntry', ['client', 'server']);
  api.addFiles(['shared/router.coffee'], ['client', 'server']);

});

Package.onTest(function (api) {
  api.use(['tinytest',
            'underscore',
            'handlebars',
            'test-helpers',
            'templating',
            'mongo-livedata',
            'coffeescript'
            ]);
  api.use(['iron:router', 'softwarerero:accounts-t9n', 'joshowens:simple-form'], ['client', 'server']);
  api.use('joshowens:accounts-entry');

  api.addFiles(['tests/route.coffee', 'tests/client.html', 'tests/client.coffee'], 'client');
});
