/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  // moved to package bz-page-home
  /*this.route('home', {
    path: '/home',
    template: 'pageHome',
    controller: 'requireLoginController' //temp
  });*/

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

  /*this.route('contacts.show', {
    path: '/contacts/:_id',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    },
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });*/

  /*this.route('chats', {
    template: 'conversations',
    controller: 'requireLoginController'
  });*/

  // end create post flow.

  this.route('pageMap', {
    path: '/map',
    template: 'pageMap',
    waitOn: function () {
      return [
        bz.help.maps.googleMapsLoad()
        //GoogleMaps.load({libraries: 'geometry,places', v: '3'})
        //GoogleMaps.load({key: bz.config.mapsKey, libraries: 'geometry,places', v: '3'})
        //GoogleMaps.load({key: 'AIzaSyCE5a0IeEGQLptVSSW-5swNFNaRUXKEWss', libraries: 'geometry,places', v: '3'})
      ];
    }
  });
  this.route('checkin', {
    path: '/check-in',
    template: 'pageCheckIn',
    waitOn: function () {
      return [
        //GoogleMaps.load({libraries: 'geometry,places', v: '3'})
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