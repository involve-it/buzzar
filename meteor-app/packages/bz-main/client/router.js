/**
 * Created by Ashot on 9/18/15.
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
  onBeforeAction: function () { // temp for closing whole site.
    //debugger;
    var openRoutes = Router.current().url === Router.routes['entrySignUp'].path() || Router.current().url === Router.routes['entrySignIn'].path();
    if (Meteor.absoluteUrl() === 'http://buzzar.io/' && !Meteor.user() && !openRoutes) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        Router.go('entrySignUp');
      }
    } else {
    }
    this.next();
  },
  // the appNotFound template is used for unknown routes and missing lists
  //notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading'
});

bz.help.makeNamespace('bz.router');

// let's extend the router with convenience method:
Router.signIn = function(isReturnBack){
  var sR = '/sign-in';
  if(Router.routes['entrySignIn']) {
    sR = Router.routes['entrySignIn'].url()
  } else {

  }
  if(isReturnBack) {
    Session.set('fromWhere', this.current().url);
  }
  Router.go(sR);
};
/***********************
 * requireLoginController
 ************************/
/*
bz.router.requireLoginController = RouteController.extend({

  onBeforeAction: function () {
    debugger;
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        Router.signIn(true);
        //Router.go('entrySignUp');
        //Router.go('entrySignIn');
      }
    } else {
      this.next();
    }
  }
});*/
