/**
 * Created by douson on 03.07.15.
 */
// POSTS:
Router.map(function () {
  this.route('chats', {
    path: '/chats',
    controller: 'requireLoginController',
    onBeforeAction: function () {
      Router.go('/chats/my');
    }
  });
  this.route('chats.chat', {
    path: '/chat/:_id',
    //template: 'postsPageDetails',
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

  this.route('chats.my', {
    path: '/chats/my',
    layoutTemplate: 'mainLayout',
    controller: 'requireLoginController'
  });

  // create post flow:
  this.route('chats.new', {
    path: '/chats/new',
    controller: 'requireLoginController'
  });
});