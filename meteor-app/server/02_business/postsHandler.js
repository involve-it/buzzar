/**
 * Created by xvolkx48 on 06.05.2016.
 */

bz.bus.postsHandler = {
  getPost: function (requestedPostId) {
    var post, locations=[], photos=[],photo,ret={},
      postDb=bz.cols.posts.findOne({_id: requestedPostId});
    if (postDb){
      post={
        _id: postDb._id,
        type: postDb.type,
        tags: postDb.tags,
        details:{
          url: postDb.details.url,
          title: postDb.details.title,
          description: postDb.details.description,
          price: postDb.details.price
        },
        status: postDb.status,
        timestamp:postDb.timestamp,
        endDate:postDb.endDate,
        social:postDb.social,
        stats:  postDb.stats
      };
      _.each(postDb.details.locations, function(item){
        locations.push({coords: item.obscuredCoords, name: item.name, placeType: item.placeType});
      });
      _.each(postDb.details.photos,function(item){
        photo=bz.cols.images.findOne({_id: item});
        if(photo) {
          photos.push({data: photo.data, thumbnail: photo.thumbnail});
        }
      });
      post.details.locations = locations;
      post.details.photos = photos;
      if(postDb.type=='jobs'){
        post.jobsDetails = postDb.jobsDetails;
      }else if (postDb.type=='trainings'){
        post.trainingsDetails=postDb.trainingsDetails;
      }else{

      }
      if (!postDb.details.anonymousPost) {
        post.user = bz.bus.usersHandler.getUser(postDb.userId, Meteor.userId()).result;
      }
      post.comments=bz.bus.commentsHandler.getComments(postDb._id);
      ret={success:true, result:post}
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
      return ret;
    }
    return ret;
  },

  getMyPosts: function(requestPage, currentUserId){
    var ret={},type,take,skip,arrIdPosts=[], posts=[],option={};
    type=requestPage.type;
    take= requestPage.take;
    skip=requestPage.skip;
    //sort
    option={skip: skip, limit: take};
    if (type=='all'){
      arrIdPosts=bz.cols.posts.find({userId: currentUserId},option).fetch();
    }else if(type=='active'){
      arrIdPosts=bz.cols.posts.find({userId: currentUserId, 'status.visible': bz.const.posts.status.visibility.VISIBLE},option).fetch();
    }else if(type=='live'){
      arrIdPosts=bz.cols.posts.find({userId: currentUserId, 'status.visible': bz.const.posts.status.visibility.VISIBLE, presences:'close'},option).fetch();
    }else{
      //error
      ret={success:false, error: bz.const.errors.posts.badRequestTypePost};
      return ret;
    }
    if (arrIdPosts.length>0) {
      _.each(arrIdPosts, function (item) {
        posts.push(bz.bus.postsHandler.getPost(item._id));
      });
    }else{
      //error
      ret={success:false, error: bz.const.errors.posts.badRequestPageNumber};
      return ret;
    }
    ret={success:true, result:posts};
    return ret;
  }

};