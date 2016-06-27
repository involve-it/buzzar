/**
 * Created by xvolkx48 on 06.05.2016.
 */
bz.bus.commentsHandler = {
  getComments: function (request) {
    var ret={}, postId,take,skip, option, comments,commentsRet, users;
    check(request,{
      postId: String,
      take: Match.Maybe(Number),
      skip: Match.Maybe(Number)
    });
    postId=request.postId;
    if(postId){
      take=request.take;
      if(take){
        take++;
      }
      skip=request.skip;
      option={ sort:{dateTime:-1},skip: skip, limit: take};
      comments=bz.cols.reviews.find({entityId: postId}, option).fetch();
      if(comments.length>0) {
        commentsRet = bz.bus.commentsHandler.buildComment(comments);
      }else{
        commentsRet=[];
      }
      ret={success:true, result: commentsRet};
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
    }
    return ret;
  },
  getCommentsCount: function(postId){
    var ret, post, count;
    check(postId, String);
    post=bz.cols.posts.findOne({_id:postId});
    if(post){
      count=bz.cols.reviews.find({entityId:postId}).count();
      ret={success:true, result:count};
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
    }
    return ret;
  },
  buildComment: function(comments){
    var ret,comment, users,usersId,arrUser, arrComments=[];
    if(comments){
      usersId=_.map(comments, function (item) {
        return item.userId;
      });
      users = bz.bus.usersHandler.userDbQuery(usersId);
      arrUser=bz.bus.usersHandler.buildUserObject(users);
      _.each(comments,function(item){
        comment={
          _id: item._id,
          text: item.text,
          dateTime: item.dateTime
        };
        comment.user=_.find(arrUser,function(user){
          return user._id==item.userId;
        });
        arrComments.push(comment)
      });
      ret=arrComments;
    }
    return ret;
  },
  addComment: function(request, currentUserId){
    var ret,commentText, postId, now, post, comment, commentAdd;
    check(currentUserId, String);
    check(request,{
      comment:String,
      postId: String
    });
    now=Date.now();
    commentText=request.comment;
    postId=request.postId;
    post=bz.cols.posts.find({_id: postId});
    if(post){
      if (commentText){
        //добавить проветрку на foul language
        if(true){
          comment={
            entityId:postId,
            userId: currentUserId,
            dateTime: now,
            text: commentText
          };
          commentAdd=bz.cols.reviews.insert(comment);
          if (commentAdd) {
            ret = {success: true, result: commentAdd};
          }else{
            //error write in DB
            ret={success:false, error: bz.const.errors.global.errorWriteInDb};
          }
        }else{
         //error
          ret={success:false, error: bz.const.errors.comments.textWithFoulLanguage};
        }
      }else{
        //error
        ret={success:false, error: bz.const.errors.comments.emptyCommentText};
      }
    }else{
      //error
      ret={success:false, error: bz.const.errors.comments.commentedPostNotFound};
    }
    return ret;
  },
  deleteComment: function(commentId, currentUserId){
    var ret, comment;
    check(commentId, String);
    check(currentUserId, String);
    comment=bz.cols.reviews.findOne({_id: commentId});
    if(comment){
      if(comment.userId===currentUserId){
        bz.cols.reviews.remove({_id: commentId});
        ret={success:true};
      }else {
        //error
        ret = {success: false, error: bz.const.errors.global.userNotAuthor};
      }
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
    }
    return ret;
  }
};