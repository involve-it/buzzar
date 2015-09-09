/**
 * Created by Ashot on 9/8/15.
 */
if (Meteor.isClient) {
  //angular.module('socially',['angular-meteor']);
}
Meteor.startup(function () {
  angular.module('myModule', ['angular-meteor'])
});