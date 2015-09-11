/**
 * Created by Ashot on 9/8/15.
 */
Template.bzControlHoneycomb.rendered = function () {
  //ng-app="socially"
  //angular.module('socially',['angular-meteor']);
  var element  = $('#myModule');
  //if(!element.hasClass('ng-scope')) {
    angular.module('myModule', ['angular-meteor']);
    angular.bootstrap(element[0], ['myModule']);
  //}
}