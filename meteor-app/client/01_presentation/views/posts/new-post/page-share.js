/**
 * Created by ashot on 8/25/15.
 */
Template.newPostPageShare.helpers({
  getPostUrl: function(e,v){
    debugger;
    return '/post/' + bz.runtime.newPost.postId;
  }
});