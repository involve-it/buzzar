Package.describe({
  name: 'arutune:bz-page-posts',
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

  api.use(['iron:router', 'iron:layout', 'mongo', 'reactive-var', 'tracker'], ['client', 'server']);
  api.use('templating', 'client');
  api.use('less', 'client');
  api.use('arutune:bz-main');
  api.addFiles([
    'server/model.js'
  ], 'server');
  api.use(['dburles:collection-helpers'], ['client', 'server']);
  api.addFiles(['collections/posts.shared.js'], ['client', 'server']);

  api.addFiles([
    'client/router.js',
    'client/model.js',
    'client/controller.js',
    'client/new-post.controller.js',
    'client/page-my.less'
  ], 'client');
  api.addFiles([
    'client/browser/common.html',

    'client/browser/details/details-controls.html',
    'client/browser/details/details-controls.less',
    'client/browser/details/details-controls.js',

    'client/browser/details/page-details.html',
    'client/browser/details/page-details.js',
    //'client/browser/my-posts/my-items.less',
    'client/browser/my-posts/my-items.html',
    'client/browser/my-posts/my-items.js',

    //'client/browser/my-posts/page-my.less',
    'client/browser/my-posts/page-my.html',
    'client/browser/my-posts/page-my.js',

    //'client/browser/my-posts/page-my.less',
    'client/browser/new-post/new-post-controls.less',
    'client/browser/new-post/new-post-controls.html',
    'client/browser/new-post/new-post-controls.js',
    'client/browser/new-post/add-new-location.html',
    'client/browser/new-post/add-new-location.js',
    'client/browser/new-post/new-url.html',
    'client/browser/new-post/new-url.js',
    'client/browser/new-post/page-new.html',
    'client/browser/new-post/page-new.js',


    'client/browser/places-autoform.less',
    'client/browser/places-autoform.html',
    'client/browser/places-autoform.js'
  ], global.bzSettings.webBrowserArray);

});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('arutune:bz-page-posts');
  api.addFiles('bz-page-posts-tests.js');
});
