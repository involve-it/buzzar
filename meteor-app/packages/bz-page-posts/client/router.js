/**
 * Created by douson on 03.07.15.
 */

/*Router.configure({
  layoutTemplate: 'mainLayout',
  waitOn: function () {
    return Meteor.subscribe('settings', function () {
      _.each(bz.cols.config.find().fetch(), function (item) {
        bz.config[item.name] = item.value;
      });
    });
  },

  // the appNotFound template is used for unknown routes and missing lists
  //notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading'
});*/

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
    template: 'postsPageDetailsIon',
    data: function () {
      var ret = bz.cols.posts.findOne({_id: this.params._id});
      return ret;
    },
    //controller: 'requireLoginController',
    onBeforeAction: function () {
      if (!this.data()) {
        Router.go('/page-not-found');
      }
      this.next();
    }
  });

  this.route('postsMy', {
    path: '/posts/my',
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
    }
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