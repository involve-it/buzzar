/**
 * Created by douson on 03.07.15.
 */

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

Router.map(function () {
  this.route('home', {
    path: '/home',
    template: 'pageHome',
    //controller: 'requireLoginController' //temp
  });
});

/***********************
 * requireLoginController
 ************************/

/*
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
});*/
