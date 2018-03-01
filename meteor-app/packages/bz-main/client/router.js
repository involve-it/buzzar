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
  /*onBeforeAction: function () { // temp for closing whole site.
    this.next();
  },*/
  // the appNotFound template is used for unknown routes and missing lists
  //notFoundTemplate: 'appNotFound',
  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading'
});

Router.map(function () {

  this.route('admin', {
    path: 'admin',
    controller: 'requireAdminUserController',
    waitOn: function () {
      return [
        Meteor.subscribe('users-admin')
      ]
    }
  });
  // add clubs later:
  this.route('bz.invitationCodes', {
    path: 'invitation-codes',
    controller: 'requireAdminUserController',
    waitOn: function () {
      return [
        Meteor.subscribe('invitationCodes')
      ]
    }
  });
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
