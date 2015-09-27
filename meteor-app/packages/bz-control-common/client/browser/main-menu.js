/**
 * Created by Ashot on 9/27/15.
 */
Template.bzControlMenuHashes.onCreated(function(){
  Meteor.subscribe('bz.hashes.all');
});
Template.bzControlMenuHashes.helpers({
  getUserHashes: function(){
    debugger;
    return bz.cols.hashes.find();
  }
})