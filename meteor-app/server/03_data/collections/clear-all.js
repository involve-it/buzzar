/**
 * Created by arutu_000 on 10/23/2015.
 */
Meteor.startup(function(){

  bz.cols.posts.remove({});
  Meteor.users.remove({});
  bz.cols.messages.remove({});
})
