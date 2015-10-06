/**
 * Created by ashot on 8/25/15.
 */
Template.postsPageDetails.onCreated(function(){

});
Template.postsPageDetails.helpers({
  getUserObj: function(){
    //debugger;
    var user = Meteor.users.findOne(this.userId);
    return user;
  }
});
