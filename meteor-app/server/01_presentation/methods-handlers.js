/**
 * Created by xvolkx48 on 29.04.2016.
 */
Meteor.methods({
  //users
  getUser:function(userId) {
      // console.log('getUser:', userId)
      return bz.bus.usersHandler.getUser(userId, Meteor.userId());
  },
  getUserByName:function(username) {
    // console.log('getUser:', userId)
    return bz.bus.usersHandler.getUserByName(username);
  },
  editUser: function(requestData){
    return bz.bus.usersHandler.editUser(requestData, Meteor.userId());
  },
  addUser: function(user){
    return  bz.bus.usersHandler.addUser(user);
  },
  socialLogIn: function(request){
    return bz.bus.socialLogInHandler.socialLogIn(request);
  },
  likeEntity: function(request){
    if (request.entityId && request.userId && request.userId == Meteor.userId() && request.entityType && bz.const.likeEntityType.all.indexOf(request.entityType) !== -1){
      var existing = bz.cols.likes.findOne({entityId: request.entityId, userId: request.userId, entityType: request.entityType});
      if (!existing){
        bz.cols.likes.insert({userId: request.userId, entityId: request.entityId, entityType: request.entityType, timestamp: new Date()});
      }
      return {success: true};
    } else {
      return { success: false};
    }
  },
  unlikeEntity: function(request){
    if (request.entityId && request.userId && request.userId == Meteor.userId() && bz.const.likeEntityType.all.indexOf(request.entityType) !== -1){
      var existing = bz.cols.likes.findOne({entityId: request.entityId, userId: request.userId, entityType: request.entityType});
      if (existing){
        bz.cols.likes.remove({entityId: request.entityId, userId: request.userId, entityType: request.entityType});
      }
      return {success: true};
    } else {
      return { success: false};
    }
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
  getNearbyPostsTest: function(request, showOffline){
    return bz.bus.postsHandler.getNearbyPosts(request, showOffline);
  },
  getPopularPosts: function(request){
    return bz.bus.postsHandler.getPopularPosts(request);
  },
  addPost: function(request, currentLocation){
    var currentUserId;
    if(!Meteor.userId() && request.IFrameUserId){
      if (Meteor.users.findOne({_id:request.IFrameUserId})){
        currentUserId = request.IFrameUserId;
      }
    }else{
      currentUserId=Meteor.userId();
    }
    var post = bz.bus.postsHandler.addPost(request,currentUserId);
    if (currentLocation){
      bz.bus.locationsHandler.reportLocation(currentLocation,currentUserId);
    }
    return post;
  },
  editPost: function(request, currentLocation){
    var post = bz.bus.postsHandler.editPost(request, Meteor.userId());
    if (currentLocation){
      bz.bus.locationsHandler.reportLocation(currentLocation);
    }
    return post;
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
  getCommentsCount: function(postId){
    return bz.bus.commentsHandler.getCommentsCount(postId);
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
    return bz.bus.messagesChatsHandler.getChats(request, Meteor.userId());
  },
  getMessages: function(request){
    return bz.bus.messagesChatsHandler.getMessages(request);
  },
  addMessage: function(request){
    return bz.bus.messagesChatsHandler.addMessage(request);
  },
  deleteMessages: function(request){
    return bz.bus.messagesChatsHandler.deleteMessages(request);
  },
  deleteChats: function(request){
    return bz.bus.messagesChatsHandler.deleteChats(request);
  },
  messagesSetSeen: function(request){
    if (request && request.messageIds && Array.isArray(request.messageIds) && request.messageIds.length > 0 && Meteor.userId()){
      var messages = bz.cols.messages.find({_id: {$in: request.messageIds}}).fetch();
      if (_.all(messages, function(message){return message.toUserId === Meteor.userId()})) {
        bz.cols.messages.update({_id: {$in: request.messageIds}}, {$set: {seen: true}}, {multi: true});
        return {success: true};
      }
    }
    return {success: false};
  },

  //locations
  addLocation: function(request){
    return bz.bus.locationsHandler.addLocation(request);
  },
  reportLocation: function(report){
    return bz.bus.locationsHandler.reportLocation(report);
  },

  getPostAdTypes:function () {
    return bz.bus.postAdTypesHandler.getPostAdTypes();    
  }
});