/**
 * Created by ashot on 8/25/15.
 */
var postUrl;

Template.newPostPageShare.onCreated(function(){
  postUrl = '/post/' + (bz.runtime.newPost.postId || 'KhrKj5NgH8CAa2WWg'); //testing only
})
Template.newPostPageShare.events({
  'click .js-get-code': function(){
    FB.ui({
      method: 'share',
      href: 'http://dev.buzzar.io' + postUrl,
    }, function(response){
    });
  }
});
Template.newPostPageShare.helpers({
  getPostUrl: function(e,v){
    return postUrl;
  },
  fbConfig: function(e,v){
    return {
      colorscheme: 'dark',
      layout: 'button_count'
    }
  }
});