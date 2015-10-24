/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  // moved to package bz-page-home

  this.route('root', {
    path: '/',
    //template: 'home',
    controller: 'requireLoginController',
    onBeforeAction: function () {
      Router.go('/home');
    }
  });

  this.route('myContacts', {
    path: 'profile/contacts',
    controller: 'requireLoginController',
    waitOn: function () {
      return [
        Meteor.subscribe('users')
      ]
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