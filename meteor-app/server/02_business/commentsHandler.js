/**
 * Created by xvolkx48 on 06.05.2016.
 */
bz.bus.commentsHandler = {
  getComments: function (request) {
    var ret={}, postId,take,skip, option, comments,commentsRet, users;
    postId=request.postId;
    if(postId){
      take=request.take;
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
      return ret;
    }

  }
};