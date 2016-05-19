/**
 * Created by xvolkx48 on 06.05.2016.
 */

bz.bus.postsHandler = {
  getPost: function (requestedPostId) {
    var post, ret={},
      postDb=bz.cols.posts.findOne({_id: requestedPostId});
    if (postDb){
      post=bz.bus.postsHandler.buildPostObject(postDb);
      ret={success:true, result:post};
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
    }
    return ret;
  },

  getMyPosts: function(requestPage, currentUserId){
    var ret={},type,take,skip,arrIdPosts=[], posts=[],option={};
    type=requestPage.type;
    take= requestPage.take;
    skip=requestPage.skip;
    option={sort:{timestamp:-1},skip: skip, limit: take};
    if (type=='all'){
      arrIdPosts=bz.cols.posts.find({userId: currentUserId},option).fetch();
    }else if(type=='active'){
      arrIdPosts=bz.cols.posts.find({userId: currentUserId, 'status.visible': bz.const.posts.status.visibility.VISIBLE},option).fetch();
    }else if(type=='live'){
      arrIdPosts=bz.cols.posts.find({userId: currentUserId, 'status.visible': bz.const.posts.status.visibility.VISIBLE, presences:{$ne: {}}},option).fetch();
    }else{
      //error
      ret={success:false, error: bz.const.errors.posts.badRequestTypePost};
      return ret;
    }
    //переделать
    if (arrIdPosts.length>0) {
      _.each(arrIdPosts, function (item) {
        posts.push(bz.bus.postsHandler.getPost(item._id).result);
      });
    }else{
      ret={success:true, result: []};
      return ret;
    }
    ret={success:true, result:posts};
    return ret;
  },

  addPost: function(request, currentUserId){
    var ret={},post, newPost, postData, validate;
    postData=request.requestPost;
    if(postData){
      validate=bz.bus.postsHandler.validatePost(postData);
      if (validate.success){
        newPost={
          userId: currentUserId,
          type: postData.type,
          tags: postData.tags,
          details: {
            anonymousPost: postData.details.anonymousPost,
            locations: postData.details.locations,
            url: postData.details.url,
            title: postData.details.title,
            description: postData.details.description,
            price: postData.details.price,
            photos: postData.details.photos,
            other: postData.details.other
          },
          status: {
            visible: bz.const.posts.status.visibility.VISIBLE
          },
          timestamp: postData.timestamp,
          endDatePost: postData.endDatePost
        };
        if (postData.type=='jobs'){
          newPost.jobsDetails={
            seniority: postData.jobsDetails.seniority,
            gender: postData.jobsDetails.gender,
            contacts: postData.jobsDetails.contacts,
            attachment: postData.jobsDetails.attachment,
            typeCategory: postData.jobsDetails.typeCategory,
            jobsType: postData.jobsDetails.jobsType,
            payMethod: postData.jobsDetails.payMethod};
        }else if(postData.type=='trainings') {
          newPost.trainingsDetails = {
            sectionLearning: postData.trainingsDetails.sectionLearning,
            typeCategory: postData.trainingsDetails.typeCategory
          };
        }
        post=bz.cols.posts.insert(newPost);
        ret={success: true, result: post._id};
      }else{
        //error not valid
        ret={success:false,error: validate};
      }
    }else {
      //error
      ret={success:false,error: bz.const.errors.posts.badRequestPostData};
    }

    return ret;
  },
  validatePost:function(post){
    var ret={};
    if (post.details) {
      //validate title
      if (post.details.title) {
        if (true) {
          //need add dictionary with foul language
          ret={success:true};
        } else {
          //error foul language
          ret={success:false, error: bz.const.errors.posts.foulLanguageInTitle};
        }
      }else{
        //error empty title
        ret={success:false, error: bz.const.errors.posts.emptyTitle};
      }
      //validate description
      if (post.details.description) {
        if (true) {
          //need add dictionary with foul language
          ret={success:true};
        } else {
          //error foul language
          ret={success:false, error: bz.const.errors.posts.foulLanguageInDescription};
        }
      } else {
        //error empty description
        ret={success:false, error: bz.const.errors.posts.emptyDescription};
      }
      //validate url
      //validate locations
      if (post.details.locations){
        ret={success:true};
      }else{
        ret={success:false, error: bz.const.errors.posts.emptyPostLocations};
      }
      //validate photo
    }else{
      //error empty details
      ret={success:false, error: bz.const.errors.posts.emptyDetails};
    }
    if(!post.timestamp){
      //error
      ret={success:false, error: bz.const.errors.posts.emptyTimestamp};
    }
    if (!post.endDatePost){
      //error
      ret={success:false, error: bz.const.errors.posts.emptyEndDatePost};
    }
    return ret;
  },
  editPost: function(request, currentUserId){
    var now, ret={},postDb, updatePost, postData, validate,update;
    postData=request.requestPost;
    now = Date.now();
    if(postData){
      if(postData._id){
        postDb=bz.cols.posts.findOne(postData._id);
        if (postDb){
          if(postDb.userId===currentUserId){
            validate=bz.bus.postsHandler.validatePost(postData);
            if (validate.success){
              updatePost={
                tags: postData.tags,
                details: {
                  anonymousPost: postData.details.anonymousPost,
                  locations: postData.details.locations,
                  title: postData.details.title,
                  description: postData.details.description,
                  price: postData.details.price,
                  photos: postData.details.photos,
                  other: postData.details.other
                },
                lastEditedTs: now
              };
              if (postData.type=='jobs'){
                updatePost.jobsDetails={
                  seniority: postData.jobsDetails.seniority,
                  gender: postData.jobsDetails.gender,
                  contacts: postData.jobsDetails.contacts,
                  attachment: postData.jobsDetails.attachment,
                  typeCategory: postData.jobsDetails.typeCategory,
                  jobsType: postData.jobsDetails.jobsType,
                  payMethod: postData.jobsDetails.payMethod};
              }else if(postData.type=='trainings') {
                updatePost.trainingsDetails = {
                  sectionLearning: postData.trainingsDetails.sectionLearning,
                  typeCategory: postData.trainingsDetails.typeCategory
                };
              }
              update=bz.cols.posts.update({_id:postData._id},{ $set : updatePost });
              if (update===1){
                ret={success:true, result: postDb._id}
              }else{
                //error write in DB
                ret={success:false, error: bz.const.errors.global.errorWriteInDb}
              }
            }else{
              //error not valid
              ret={success:false,error: validate};
            }
          }else{
            //error
            ret={success:false,error:bz.const.errors.posts.userNotAuthor};
          }
        }else{
          //error
          ret={success:false,error: bz.const.errors.global.dataNotFound};
        }
      }else{
        //error
        ret={success:false,error: bz.const.errors.posts.notSpecifiedIdPost};
      }
    }else{
      //error
      ret={success:false,error: bz.const.errors.posts.badRequestPostData};
    }
    return ret;
  },

  buildPostObject: function(postDb){
    var post, ret={}, locations=[], photos=[],photo;
    post={
      _id: postDb._id,
      type: postDb.type,
      tags: postDb.tags,
      details:{
        url: postDb.details.url,
        title: postDb.details.title,
        description: postDb.details.description,
        price: postDb.details.price,
        other: postDb.details.other
      },
      presences: postDb.presences,
      status: postDb.status,
      timestamp:postDb.timestamp,
      endDatePost:postDb.endDatePost,
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
      post.user = bz.bus.usersHandler.getUser(postDb.userId, Meteor.userId());
    }
    post.comments=bz.bus.commentsHandler.getComments(postDb._id);
    ret = post;
    return ret;
  },

  deletePost: function(requestedPostId, currentUserId){
    var ret={},
      postDb=bz.cols.posts.findOne({_id: requestedPostId});
    if(postDb){
      if(postDb.userId===currentUserId){
        bz.cols.posts.remove(requestedPostId);
      }else{
        //error
        ret={success:false,error:bz.const.errors.posts.userNotAuthor};
      }
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
    }
    ret={success:true};
    return ret;
  }

};