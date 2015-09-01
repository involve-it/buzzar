/**
 * Created by douson on 03.07.15.
 */
if(Meteor.isCordova || Meteor.isMobile) {
  Router.configure({
    layoutTemplate: 'mainLayoutApp',
    waitOn: function () {
      return Meteor.subscribe('settings');
    },

    // the appNotFound template is used for unknown routes and missing lists
    notFoundTemplate: 'appNotFound',

    // show the appLoading template whilst the subscriptions below load their data
    loadingTemplate: 'appLoading'
  });
} else {
  Router.configure({
    layoutTemplate: 'mainLayout',
    waitOn: function () {
      return Meteor.subscribe('settings', function () {
        _.each(bz.cols.config.find().fetch(), function (item) {
          bz.config[item.name] = item.value;
        });
      });
    },

    // the appNotFound template is used for unknown routes and missing lists
    notFoundTemplate: 'appNotFound',

    // show the appLoading template whilst the subscriptions below load their data
    loadingTemplate: 'appLoading'
  });
}
Router.map(function () {
  this.route('home', {
    path: '/home',
    template: 'pageHome',
    controller: 'requireLoginController'
  });

  this.route('search', {
    path: '/',
    template: 'globalSearchIon',
    controller: 'requireLoginController',
    
    /* ВРЕМЕННОЕ УДАЛИТЬ ПОСЛЕ СОЗДАНИЯ ДИЗАЙНА */
    waitOn: function () {
          return [
              Meteor.subscribe('users'),
              GoogleMaps.load({libraries: 'geometry,places', v: '3'})
              //GoogleMaps.load({key: bz.config.mapsKey, libraries: 'geometry,places', v: '3'})
              //GoogleMaps.load({key: 'AIzaSyCE5a0IeEGQLptVSSW-5swNFNaRUXKEWss', libraries: 'geometry,places', v: '3'})
          ];
    }
  });

  this.route('settings', {
    template: 'userSettings',
    controller: 'requireLoginController',
    waitOn: function () {
      return [
        Meteor.subscribe('users')
      ]
    },
    data: function () {
      return Meteor.user();
    }
  });

  this.route('settings.edit', {
    path: '/settings/:_id',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    },
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });

  this.route('contacts', {
    path: 'contacts',
    controller: 'requireLoginController',
    waitOn: function () {
      return [
        Meteor.subscribe('users')
      ]
    }
  });

  this.route('contacts.show', {
    path: '/contacts/:_id',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    },
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });

  this.route('chats', {
    template: 'conversations',
    controller: 'requireLoginController'
  });

  // POSTS:
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
      var ret =  bz.cols.posts.findOne({_id: this.params._id});
      return ret;
    },
    //controller: 'requireLoginController',
    onBeforeAction: function () {
      if(!this.data()){
        Router.go('/page-not-found');
      }
      this.next();
    }
  });

  this.route('posts.my', {
    path: '/posts/my',
    controller: 'requireLoginController'
  });

  // create post flow:
  this.route('posts.new', {
    path: '/posts/new',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    }
    /*data: function () {
     return Meteor.users.findOne({_id: this.params._id});
     }*/
  });
  this.route('posts.new.share', {
    path: '/posts/new/share',
    template: 'newPostPageShare',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    }
  });
  /*this.route('posts.new.original-details', {
    path: '/posts/new/original-details',
    controller: 'requireLoginController'
  });*/
  // end create post flow.

  this.route('map', {
    path: '/map',
    template: 'postsMap',
    waitOn: function () {
      return [
        GoogleMaps.load({libraries: 'geometry,places', v: '3'})
        //GoogleMaps.load({key: bz.config.mapsKey, libraries: 'geometry,places', v: '3'})
        //GoogleMaps.load({key: 'AIzaSyCE5a0IeEGQLptVSSW-5swNFNaRUXKEWss', libraries: 'geometry,places', v: '3'})
      ];
    }
  });

  // COMMON:
  this.route('pageNotFound', {
    path: '/page-not-found'
  });
});

/***********************
 * requireLoginController
 ************************/

requireLoginController = RouteController.extend({

  onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        Router.go('entrySignUp');
        //Router.go('entrySignIn');
      }
    } else {
      this.next();
    }
  }
});