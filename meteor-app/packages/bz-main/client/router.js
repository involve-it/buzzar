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
    if (!Meteor.user() && !openRoutes) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        Router.go('entrySignUp');
        this.next();

        //Router.go('entrySignIn');
      }
    } else {
      this.next();
    }
  },
  // the appNotFound template is used for unknown routes and missing lists
  //notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading'
});

bz.help.makeNamespace('bz.router');


/***********************
 * requireLoginController
 ************************/
bz.router.requireLoginController = RouteController.extend({

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