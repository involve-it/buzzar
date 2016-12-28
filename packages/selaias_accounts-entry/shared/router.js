var exclusions;

Router.route("entrySignIn", {
  path: "/sign-in",
  layoutTemplate: 'basicLayout',
  name: 'entrySignIn',
  template: 'entrySignIn',
  onBeforeAction: function() {
    Alerts.clear();
    Session.set('buttonText', 'in');
    this.next();
  },
  onRun: function() {
    var pkgRendered, userRendered;
    if (Meteor.userId()) {
      Router.go(AccountsEntry.settings.dashboardRoute);
    }
    if (AccountsEntry.settings.signInTemplate) {
      this.template = AccountsEntry.settings.signInTemplate;
      pkgRendered = Template.entrySignIn.rendered;
      userRendered = Template[this.template].rendered;
      if (userRendered) {
        Template[this.template].rendered = function() {
          pkgRendered.call(this);
          return userRendered.call(this);
        };
      } else {
        Template[this.template].rendered = pkgRendered;
      }
      Template[this.template].events(AccountsEntry.entrySignInEvents);
      Template[this.template].helpers(AccountsEntry.entrySignInHelpers);
    }
    this.next();
  }
});
Router.route("entrySignUp", {
  path: "/sign-up",
  layoutTemplate: 'basicLayout',
  name: 'entrySignUp',
  template: 'entrySignUp',
  onBeforeAction: function() {
    Alerts.clear();
    Session.set('buttonText', 'up');
    this.next();
  },
  onRun: function() {
    var pkgRendered, userRendered;
    if (AccountsEntry.settings.signUpTemplate) {
      this.template = AccountsEntry.settings.signUpTemplate;
      pkgRendered = Template.entrySignUp.rendered;
      userRendered = Template[this.template].rendered;
      if (userRendered) {
        Template[this.template].rendered = function() {
          pkgRendered.call(this);
          userRendered.call(this);
        };
      } else {
        Template[this.template].rendered = pkgRendered;
      }
      Template[this.template].events(AccountsEntry.entrySignUpEvents);
      Template[this.template].helpers(AccountsEntry.entrySignUpHelpers);
    }
    this.next();
  }
});
Router.route("entryForgotPassword", {
  path: "/forgot-password",
  layoutTemplate: 'basicLayout',
  name: 'entryForgotPassword',
  template: 'entryForgotPassword',
  onBeforeAction: function() {
    Alerts.clear();
    this.next();
  }
});
Router.route('entrySignOut', {
  path: '/sign-out',
  layoutTemplate: 'basicLayout',
  name: 'entrySignOut',
  template: 'entrySignOut',
  onBeforeAction: function() {
    Alerts.clear();
    if (AccountsEntry.settings.homeRoute) {
      var userId = Meteor.userId();
      Meteor.logout();
      Router.go(AccountsEntry.settings.homeRoute);
      var deviceId;
      if (Meteor.isCordova){
        deviceId = device.uuid;
      }
      Meteor.call('logOut', userId, deviceId, function () {
      });
    }
    this.next();
  }
});
Router.route('entryResetPassword', {
  path: 'reset-password/:resetToken',
  layoutTemplate: 'basicLayout',
  name: 'entryResetPassword',
  template: 'entryResetPassword',
  onBeforeAction: function() {
    Alerts.clear();
    Session.set('resetToken', this.params.resetToken);
    this.next();
  }
});

Router.route('entryEmailVerificationPending', {
  path: '/verification-pending',
  layoutTemplate: 'basicLayout',
  name: 'entryEmailVerificationPending',
  template: 'entryEmailVerificationPending',
  onBeforeAction: function() {
    Alerts.clear();
    this.next();
  }
});

exclusions = [];

_.each(Router.routes, function(route) {
  return exclusions.push(route.name);
});

Router.onStop(function() {
  if (!_.contains(exclusions, (Router.current().route) !== null ? Router.current().url : undefined)) {
    var url = Router.current().url;
    var arr = url && url.split('/');
    if (arr[arr.length - 1] !== 'sign-in') {
      Session.set('fromWhere', Router.current().url);
    }
  }
});