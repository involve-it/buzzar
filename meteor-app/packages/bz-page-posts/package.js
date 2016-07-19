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

  api.use(['underscore', 'iron:router', 'iron:layout', 'mongo', 'reactive-var', 'tracker', 'ecmascript', 'dburles:collection-helpers',
    'arutune:bz-main', 'ground:db'
  ], ['client', 'server']);
  api.use(['percolate:synced-cron'
  ], 'server');
  api.use(['templating', 'less'], 'client');
  api.addFiles([
    'server/main.js',
    'server/model.js'
  ], 'server');

  api.addFiles(['collections/posts.shared.js'], ['client', 'server']);

  api.addFiles([
    'client/i18n/english.js',
    'client/i18n/russian.js',
    'client/router.js',
    'client/model.js',
    'client/post.controller.js',
    'client/edit-post.controller.js',
    'client/new-post.controller.js',
    'client/page-my.less',
    'client/vendor/ui-kit.js',
    'client/vendor/components/tooltip.js'
  ], 'client');

  api.addFiles([
    'client/browser/common.html',
    'client/browser/post-ad-details-forms.html',
    'client/browser/post-ad-details-forms.js',
    'client/browser/post-controls.html',
    'client/browser/post-controls.less',
    'client/browser/post-controls.js',
      
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
    'client/browser/edit-post/edit-post-controls.html',
    'client/browser/edit-post/edit-post-controls.js',
    'client/browser/edit-post/edit-post-controls.less',
    'client/browser/edit-post/page-edit.html',
    'client/browser/edit-post/page-edit.js',
    'client/browser/edit-post/page-edit.less',

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

    'client/browser/new-post/anonymous-post.html',
    'client/browser/new-post/anonymous-post.js',
    'client/browser/new-post/anonymous-post.less',

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
