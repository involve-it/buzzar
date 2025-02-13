Package.describe({
    name: 'arutune:bz-control-honeycomb',
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

    api.use(['templating', 'less'], 'client');
    api.use('angular', 'client');

    api.addFiles([
        'client/lib/honeycomb.less',
        'client/lib/honeycomb.js',
        'client/router.js',
        'client/controller.js',
        'client/models.js',
    ], 'client');

    api.addFiles([
        'client/browser/app.js',
        'client/browser/honeycomb.less',
        'client/browser/honeycomb.html',
        'client/browser/honeycomb.js',
    ], global.bzSettings.webBrowserArray);
});