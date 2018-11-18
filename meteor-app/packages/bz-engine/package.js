Package.describe({
  name: 'arutune:bz-engine',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Encapsulates user live presence, proximity, distance calculations, messaging',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.use(['ecmascript', 'underscore', 'mongo', 'http']);
  api.use(['edgee:slingshot']); // file uploads to AWS
    api.addFiles([
            'controller.server.js'
        ], ['server']
    );
    api.addFiles([
        'shared/01_inits/01_init.js',
        'shared/01_inits/02_helpers.js',
        'shared/01_inits/03_extends.js',
        'shared/01_inits/04_constants.js',

        'shared/02_data/locations.js',
        'shared/02_data/logs.js',
        'shared/02_data/chats.js',
        'shared/02_data/cities.js',

        'shared/03_business/posts.js',
        'shared/03_business/location.js',
        'shared/03_business/logs.js',

        'shared/03_business/postsHandler.js',
        'shared/03_business/proximityHandler.js',
        'shared/03_business/pushHandler.js',
        'shared/03_business/usersHandler.js',

        'controller.shared.js'
    ]);
    api.addFiles([
        'constants/all.js',
        'constants/errors.js'
    ], ['client', 'server']);

    api.addFiles([
        'server/01_presentation/methods.js',
        'server/01_presentation/methods.handlers.js',

        // 'server/02_business/fake-statuses.js',
        'server/03_business/locationsHandler.js',
        'server/03_business/messagesChatsHandler.js',

        'server/02_data/cities.js',
        'server/02_data/messages.js',
        'server/02_data/posts.js',
        'server/02_data/tokens.js'

    ], 'server');
});
