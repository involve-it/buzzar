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
  searchPosts: function(request){
    return bz.bus.postsHandler.searchPosts(request);
  },
  getPost: function(postId){
    return bz.bus.postsHandler.getPost(postId);
  },
  getMyPosts: function(requestPage){
    return bz.bus.postsHandler.getMyPosts(requestPage, Meteor.userId());
  },
  getNearbyPostsTest: function(request){
    return bz.bus.postsHandler.getNearbyPosts(request);
  },
  getPopularPosts: function(request){
    return bz.bus.postsHandler.getPopularPosts(request);
  },
  addPost: function(requset){
    return bz.bus.postsHandler.addPost(requset, Meteor.userId());
  },
  editPost: function(requset){
    return bz.bus.postsHandler.editPost(requset, Meteor.userId());
  },
  deletePost: function(request){
    return bz.bus.postsHandler.deletePost(request, Meteor.userId());
  },

  //comments
  getComments: function(request){
    return bz.bus.commentsHandler.getComments(request);
  },
  addComment: function(request){
    return bz.bus.commentsHandler.addComment(request, Meteor.userId());
  },
  deleteComment: function(commentId){
    return bz.bus.commentsHandler.deleteComment(commentId,Meteor.userId());
  },

  //images
  addImage: function(request){
    return bz.bus.imagesHandler.addImage(request, Meteor.userId());
  },
  deleteImage: function(url){
    return bz.bus.imagesHandler.deleteImage(url);
  },

  //messagesChats
  getChat: function(chatId){
    return bz.bus.messagesChatsHandler.getChat(chatId);
  },
  getChats: function(request){
    return bz.bus.messagesChatsHandler.getChats(request);
  }
});