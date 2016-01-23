/**
 * Created by douson on 03.07.15.
 */
var requireLoginController = bz.router.requireLoginController;
// POSTS:
Router.map(function () {
  this.route('posts', {
    path: '/posts',
    controller: 'requireLoginController',
    onBeforeAction: function () {
      Router.go('/posts/my');
    }

  });
  this.route('posts.details', {
    path: '/post/:_id',
    template: 'postsPageDetails',
    data: function () {
      var ret;
      ret = bz.cols.posts.findOne({_id: this.params._id});
      if (ret) {
        Meteor.subscribe('users-one', ret.userId)
      }
      return ret;
    },
    //controller: 'requireLoginController',
    onAfterAction: function () {
      var post = this.data();
      post && runHitTracking(post);
      console.log('onAfterAction' + this.data());
    },
    onBeforeAction: function () {
      if (!this.data()) {
        Router.go('/page-not-found');
      }
      this.next();
    }
  });
  this.route('posts.edit', {
    path: '/posts/:_id/edit',
    template: 'pagePostsEdit',
    data: function () {
      var ret;
      ret = bz.cols.posts.findOne({_id: this.params._id});
      if (ret) {
        Meteor.subscribe('users-one', ret.userId)
      }
      return ret;
    },
    //controller: 'requireLoginController',
    onBeforeAction: function () {
      if (!this.data()) {
        Router.go('/page-not-found');
      } else {
      }
      this.next();
    },
    onStop: Router.UnsavedPageRouteStopHandler
  });

  this.route('postsMy', {
    path: '/posts/my',
    layoutTemplate: 'mainLayout',
    controller: 'requireLoginController'
  });

  // create post flow:
  this.route('postsNew', {
    path: '/posts/new',
    controller: 'requireLoginController',
    waitOn: function () {
      return [
        bz.help.maps.googleMapsLoad()
      ]
    },
    onBeforeAction: function () {
      if (this.params.query.type && this.params.query.type !== 'undefined') {
        newPostType.set(this.params.query.type);
      } else {
        newPostType.set(undefined);
      }
      this.next();
    },
    onStop: Router.UnsavedPageRouteStopHandler

    /*data: function () {
     return Meteor.users.findOne({_id: this.params._id});
     }*/
  });
  this.route('postsNewShare', {
    path: '/posts/new/share',
    template: 'newPostPageShare',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    }
  });
});