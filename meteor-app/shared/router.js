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
Meteor.startup(function () {
  baseController = RouteController.extend({
    onStop: function () {
      /*CONSOLE CLEAR
      console.log('baseController - route stopped: ' + new Date());
      */
      //bz.ui.spinnerAdd('body', true);
    },
    /*onAfterAction: function () {
      bz.ui.spinnerRemove('body', true);
    }*/
    // temporarily close:
      onBeforeAction: function () {
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
  });
  requireLoginController = baseController.extend({
//requireLoginController = FastRender.RouteController.extend({
    onBeforeAction: function () {
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
  });
  requireAdminUserController = baseController.extend({
//requireLoginController = FastRender.RouteController.extend({
    onBeforeAction: function () {
      if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
        } else {
          Router.signIn(true);
        }
      } else if (Meteor.user().isAdmin()){
        this.next();
      } else {
        bz.ui.error('Необходимы права администратора!')
      }
    }
  });
  requireAdminRoleUserController = baseController.extend({
    onBeforeAction: function () {
      if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
        } else {
          Router.signIn(true);
        }
      } else if (Meteor.user().isAdminRole()){
        this.next();
      } else {
        bz.ui.error('Необходимы права администратора!')
      }
    }
  });
});
