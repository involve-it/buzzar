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
  getMyPosts: function(){
    return 0;
  },
  getNearbyPostsTest: function(){
    return 0;
  },
  getPopularPosts: function(){
    return 0;
  },
  addPost: function(){
    return 0;
  },
  editPostTest: function(){
    return 0;
  },
  deletePost: function(){
    return 0;
  },

  //comments
  getComments: function(postId){
    return 0;
  },
  addComment: function(postId){
    return 0;
  },
  deleteComment: function(postId){
    return 0;
  }
});