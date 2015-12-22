/**
 * Created by douson on 06.07.15.
 */

bz.help.maps.initLocation();
/*
Template.ionSideMenuContent.rendered = function () {

  var template = this;
  var content = this.find('.menu-content');
  content.setAttribute('id', 'drag-content');
};


Template.ionBody.rendered = function () {

  /!*side menu settings*!/
  if (Meteor.user()) {

   /!* IonSideMenu.snapper.settings({
      /!*disable: 'right',*!/
      /!*touchToDrag: false,*!/
      /!*hyperextensible: false,*!/
      element: document.getElementById('drag-content'),
      dragger: document.getElementById('drag-right')
    });*!/

  }
};
*/

angular
    .module('Whatsapp', [
      'angular-meteor',
      'ionic'
    ]);

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}

function onReady() {
  angular.bootstrap(document, ['Whatsapp']);
}

angular
    .module('Whatsapp')
    .config(config);

function config($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'client/templates/tabs.html'
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'client/templates/chats.html'
          }
        }
      });

  $urlRouterProvider.otherwise('tab/chats');
}
