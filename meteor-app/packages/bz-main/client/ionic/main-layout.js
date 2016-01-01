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

angular.module('Whatsapp', [
  'angular-meteor',
  'ionic'
]).config(config);

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}

function onReady() {
  console.log('angular.bootstrap');
  angular.bootstrap(document, ['Whatsapp']);
}

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
  console.log('$urlRouterProvider.otherwise();');
  //$urlRouterProvider.otherwise('tab/chats');
}
