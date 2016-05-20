/**
 * Created by xvolkx48 on 29.04.2016.
 */
Meteor.methods({
  //users
  getUser:function(userId) {
    return bz.bus.usersHandler.getUser(userId, Meteor.userId());
  },
  editUser: function(requestData){
    return bz.bus.usersHandler.editUser(requestData, Meteor.userId());
  },
  addUser: function(user){
    return  bz.bus.usersHandler.addUser(user);
  },

  //posts
  getPost: function(postId){
    return bz.bus.postsHandler.getPost(postId);
  },
  getMyPosts: function(requestPage){
    return bz.bus.postsHandler.getMyPosts(requestPage, Meteor.userId());
  },
  getNearbyPostsTest: function(){
    return 0;
  },
  getPopularPosts: function(){
    return 0;
  },
  addPost: function(requset){
    return bz.bus.postsHandler.addPost(requset, Meteor.userId());
  },
  editPostTest: function(requset){
    return bz.bus.postsHandler.editPost(requset, Meteor.userId());
  },
  deletePost: function(request){
    return bz.bus.postsHandler.deletePost(request, Meteor.userId());
  },

  //comments
  getComments: function(request){
    return bz.bus.commentsHandler.getComments(request);
  },
  addComment: function(postId){
    return 0;
  },
  deleteComment: function(postId){
    return 0;
  }
});