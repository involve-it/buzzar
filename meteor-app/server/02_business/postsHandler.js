/**
 * Created by xvolkx48 on 06.05.2016.
 */

bz.bus.postsHandler = {
  searchPosts: function(request){
    var ret,query, lat,lng,radius,skip,take, postsQuery={},posts,arrTypes=[], activeCats,box,postsRet,postsSort, coords, loc;
    query=request.query;
    lat=request.lat;
    lng=request.lng;
    radius=request.radius;
    skip=request.skip;
    take=request.take;
    activeCats=request.activeCats;
    if (lat && lng && radius) {
      box = bz.bus.proximityHandler.getLatLngBox(lat, lng, radius);
      if (box) {
        postsQuery['details.locations'] = {
          $elemMatch: {
            'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
            'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
          }
        };
      }
    }else{

    }
    if (activeCats && Array.isArray(activeCats) && activeCats.length > 0) {
      postsQuery['type'] = {$in: activeCats};
    } else {
      arrTypes = _.map(bz.cols.postAdTypes.find().fetch(), function (item) {
        return item.name;
      });
      arrTypes.push(undefined);
      arrTypes.push('');
      postsQuery['type'] = {$in: arrTypes};
    }
    postsQuery['$or'] = [
      {'details.title': {$regex: query}},
      {'details.description': {$regex: query}},
      {'details.price': {$regex: query}}
    ];
    postsQuery['status'] ={visible: bz.const.posts.status.visibility.VISIBLE};
    posts= bz.cols.posts.find(postsQuery).fetch();
    if (lat && lng) {
      _.each(posts, function (post) {
        if (post.details && post.details.locations && Array.isArray(post.details.locations) && post.details.locations.length > 0) {
          loc = _.find(post.details.locations, function (l) {
            return l.placeType === bz.const.locations.type.DYNAMIC
          });
          if (!loc) {
            loc = post.details.locations[0];
          }
          coords = loc.obscuredCoords || loc.coords;
          post.distance = bz.help.location.getDistance(lat, lng, coords.lat, coords.lng);
        }
      });
      postsSort=posts.sort(function(a,b){return a.distance-b.distance});
    }
    postsRet=bz.bus.postsHandler.buildPostsObject({posts:postsSort});
    ret={success:true, result:postsRet};
    return ret;
  },
  getPost: function (requestedPostId) {
    var post, ret={},
      postDb=bz.cols.posts.findOne({_id: requestedPostId});
    if (postDb){
      post=bz.bus.postsHandler.buildPostsObject({posts:[postDb]});
      ret={success:true, result:post[0]};
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
    }
    return ret;
  },

  getMyPosts: function(requestPage, currentUserId){
    var ret={},type,take,skip,arrPosts=[], posts=[],option;
    type=requestPage.type;
    take= requestPage.take;
    skip=requestPage.skip;
    option={sort:{timestamp:1},skip: skip, limit: take};
    if (type=='all'){
      arrPosts=bz.cols.posts.find({userId: currentUserId},option).fetch();
    }else if(type=='active'){
      arrPosts=bz.cols.posts.find({userId: currentUserId, 'status.visible': bz.const.posts.status.visibility.VISIBLE},option).fetch();
    }else if(type=='live'){
      arrPosts=bz.cols.posts.find({userId: currentUserId, 'status.visible': bz.const.posts.status.visibility.VISIBLE, presences:{$ne: {}}},option).fetch();
    }else{
      //error
      ret={success:false, error: bz.const.errors.posts.badRequestTypePost};
      return ret;
    }
    if (arrPosts.length>0) {
      posts=bz.bus.postsHandler.buildPostsObject({posts:arrPosts});
      ret={success:true, result:posts};
    }else{
      ret={success:true, result: []};
    }
    return ret;
  },

  addPost: function(request, currentUserId){
    var ret={},post, newPost, postData, validate, locations=[],loc;
    postData=request;
    if(postData && currentUserId){
      validate=bz.bus.postsHandler.validatePost(postData);
      if (validate.success){
        var photos = [];
        if (postData.details && postData.details.photos && postData.details.photos.length > 0 && typeof postData.details.photos[0] === 'object'){
          var photo;
          _.each(postData.details.photos, function(e){
            if (e.data) {
              photo = {
                userId: currentUserId,
                name: null,
                data: e.data,
                thumbnail: e.data
              };
              photos.push(bz.cols.images.insert(photo));
            }
          });
        } else {
          photos = postData.details.photos || [];
        }
        newPost={
          userId: currentUserId,
          type: postData.type,
          tags: postData.tags,
          details: {
            anonymousPost: postData.details.anonymousPost,
            url: postData.details.url,
            title: postData.details.title,
            description: postData.details.description,
            price: postData.details.price,
            photos: photos,
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
        if (postData.details && postData.details.locations) {
          _.each(postData.details.locations, function(location){
            if (location.placeType === bz.const.locations.type.DYNAMIC){
              location.obscuredCoords = bz.bus.proximityHandler.getObscuredCoords(location.coords, 0.1);
            }
          });
          _.each(postData.details.locations, function(location){
            loc ={
              userId: location.userId,
              name:location.name,
              accurateAddress:location.accurateAddress,
              coords:location.coords,
              placeType:location.placeType,
              public:location.public,
              _id:location._id,
              obscuredCoords: bz.bus.proximityHandler.getObscuredCoords(location.coords, 0.1)
            };
            locations.push(loc)
          });
          newPost.details.locations=locations;
        }

        post=bz.cols.posts.insert(newPost);
        ret={success: true, result: post};
      }else{
        //error not valid
        ret={success:false,error: validate.error};
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
          return ret;
        }
      }else{
        //error empty title
        ret={success:false, error: bz.const.errors.posts.emptyTitle};
        return ret;
      }
      /*
      //validate description
      if (post.details.description) {
        if (true) {
          //need add dictionary with foul language
          ret={success:true};
        } else {
          //error foul language
          ret={success:false, error: bz.const.errors.posts.foulLanguageInDescription};
          return ret;
        }
      } else {
        //error empty description
        ret={success:false, error: bz.const.errors.posts.emptyDescription};
        return ret;
      }
      */
      //validate url
      //validate locations
      if (post.details.locations){
        ret={success:true};
      }else{
        //error
        ret={success:false, error: bz.const.errors.posts.emptyPostLocations};
        return ret;
      }
      //validate photo
    }else{
      //error empty details
      ret={success:false, error: bz.const.errors.posts.emptyDetails};
      return ret;
    }
    /*if(!post.timestamp){
      //error
      ret={success:false, error: bz.const.errors.posts.emptyTimestamp};
      return ret;
    }
    if (!post.endDatePost){
      //error
      ret={success:false, error: bz.const.errors.posts.emptyEndDatePost};
      return ret;
    }*/
    return ret;
  },
  editPost: function(request, currentUserId){
    var now, ret={},postDb, updatePost, postData, validate,update, locations=[],loc;
    postData=request;
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
                  title: postData.details.title,
                  description: postData.details.description,
                  price: postData.details.price,
                  //photos: postData.details.photos,
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

              if (postData.details && postData.details.locations) {
                _.each(postData.details.locations, function(location){
                  if (location.placeType === bz.const.locations.type.DYNAMIC){
                    location.obscuredCoords = bz.bus.proximityHandler.getObscuredCoords(location.coords, 0.1);
                  }
                });
                _.each(postData.details.locations, function(location){
                  loc ={
                    userId: location.userId,
                    name:location.name,
                    accurateAddress:location.accurateAddress,
                    coords:location.coords,
                    placeType:location.placeType,
                    public:location.public,
                    _id:location._id,
                    obscuredCoords: bz.bus.proximityHandler.getObscuredCoords(location.coords, 0.1)
                  };
                  locations.push(loc)
                });
                updatePost.details.locations=locations;
              }

              update=bz.cols.posts.update({_id:postData._id},{ $set : updatePost });
              if (update){
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
            ret={success:false,error:bz.const.errors.global.userNotAuthor};
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
  buildPostObject: function(_post) {
    var locations = [], postDb = _post, post = _post;
    // obscure locations:
    _.each(postDb.details.locations, function (item) {
      locations.push({_id: item._id,
        coords: item.obscuredCoords,
        name: item.name, placeType: item.placeType});
    });
    post.details.locations = locations;
    // return photos as array of urls instead of ids:
    if(postDb.details.photos && postDb.details.photos.length>0) {
      post.details.photosUrls = bz.cols.images.find({ _id: {$in: post.details.photos }}).fetch().map(function(p) { return p.data;});
    }
    // hz:?
    /*if (postDb.type == 'jobs') {
      post.jobsDetails = postDb.jobsDetails;
    } else if (postDb.type == 'trainings') {
      post.trainingsDetails = postDb.trainingsDetails;
    } else {

    }*/
    // return user object instead of user id, only for non-anon:
    if (!postDb.details.anonymousPost) {
      post.user = Meteor.users.findOne(postDb.userId);
    }
    return post;
  },
  buildPostsObject: function(data, isMobile){
    var post,posts,postsRet=[], ret={}, locations=[],arrPhoto, photos,usersIds, arrUsers, users;
    posts=data.posts;
    if (posts && posts.length>0) {
      usersIds = _.map(posts, function (post) {
        return post.userId
      });
      arrUsers = bz.bus.usersHandler.userDbQuery(usersIds);
      users = bz.bus.usersHandler.buildUserObject(arrUsers);
      arrPhoto = _.map(posts, function (post) {
        return post.details.photos
      }).reduce(function (a, b) {
        return a.concat(b);
      }).filter(function(p) { return !!p; });
      if (arrPhoto.length > 0) {
        photos = bz.bus.imagesHandler.getPhotos(arrPhoto);
      }
      _.each(posts, function (postDb) {
        locations = [];
        post = {
          _id: postDb._id,
          type: postDb.type,
          tags: postDb.tags,
          details: {
            url: postDb.details.url,
            title: postDb.details.title,
            description: postDb.details.description,
            price: postDb.details.price,
            other: postDb.details.other
          },
          presences: postDb.presences,
          status: postDb.status,
          timestamp: postDb.timestamp,
          timePause: postDb.timePause,
          endDatePost: postDb.endDatePost,
          social: postDb.social,
          stats: postDb.stats,
          lastEditedTs: postDb.lastEditedTs
        };
        _.each(postDb.details.locations, function (item) {

          locations.push({_id: item._id,
            coords: bz.bus.proximityHandler.getObscuredCoords(item.coords, 0.1),
            name: item.name, placeType: item.placeType});
        });

        post.details.locations = locations;
        if(postDb.details.photos) {
          post.details.photos = _.filter(photos, function (photo) {
            return postDb.details.photos.indexOf(photo._id) !== -1
          });
        }
        if(postDb.details.photosUrls) {
          post.details.photosUrls = postDb.details.photosUrls;
        }
        if (postDb.type == 'jobs') {
          post.jobsDetails = postDb.jobsDetails;
        } else if (postDb.type == 'trainings') {
          post.trainingsDetails = postDb.trainingsDetails;
        } else {

        }
        if (!postDb.details.anonymousPost) {
          post.user = _.filter(users, function (user) {
            return user._id === postDb.userId
          })[0];
        }

        postsRet.push(post);
      });
      ret = postsRet;
    }
    return ret;
  },
  getNearbyPosts: function(request){
    var ret, lat, lng, radius, skip, take, postsQuery={}, posts, arrTypes=[], activeCats, box, postsRet, postsSort, coords, loc,
        curLocation,
        serverLimit = 20, options, optionsForArray;
    lat=request.lat;
    lng=request.lng;
    radius=request.radius; //request.radius;
    skip=request.skip;
    take=request.take || serverLimit;
    activeCats=request.activeCats;
    // curLocation = request.curLocation;
    if(lat && lng) {
      curLocation = {
        coords: {
          lat: lat,
          lng: lng
        }
      }
    }
    options = {
      sort: { 'stats.seenTotal': -1 },
      skip: skip,
      limit: take
    };
    optionsForArray = {
      sort: function(a, b) {
        var diff = bz.help.posts.getDistanceToCurrentLocationNumber.call(a, undefined, curLocation)
            - bz.help.posts.getDistanceToCurrentLocationNumber.call(b, undefined, curLocation);
        return diff;
      }
    };
    if (lat && lng && radius) {
      box = bz.bus.proximityHandler.getLatLngBox(lat, lng, radius);
      if (box) {
        postsQuery['details.locations'] = {
          $elemMatch: {
            'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
            'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
          }
        };
      }
    }else{

    }
    if (activeCats && Array.isArray(activeCats) && activeCats.length > 0) {
      postsQuery['type'] = {$in: activeCats};
    } else {
      arrTypes = _.map(bz.cols.postAdTypes.find().fetch(), function (item) {
        return item.name;
      });
      arrTypes.push(undefined);
      arrTypes.push('');
      postsQuery['type'] = {$in: arrTypes};
    }
    postsQuery['status'] = { visible:  bz.const.posts.status.visibility.VISIBLE };
    posts = bz.cols.posts.find(postsQuery, options).fetch().sort(optionsForArray.sort);
    /*if (lat && lng) {
      _.each(posts, function (post) {
        if (post.details && post.details.locations && Array.isArray(post.details.locations) && post.details.locations.length > 0) {
          loc = _.find(post.details.locations, function (l) {
            return l.placeType === bz.const.locations.type.DYNAMIC
          });
          if (!loc) {
            loc = post.details.locations[0];
          }
          coords = loc.obscuredCoords || loc.coords;
          post.distance = bz.help.location.getDistance(lat, lng, coords.lat, coords.lng);
        }
      });
      postsSort=posts;/!*.sort(function(a,b) {
        return a.distance-b.distance;
      });*!/
    }*/
    postsRet = bz.bus.postsHandler.buildPostsObject({ posts:posts });
    //postsRet = posts;
    ret = { success:true, result:postsRet };
    return ret;
  },
  getPopularPosts: function(request){
    var ret, lat, lng, radius, skip, take, postsQuery={}, posts, arrTypes=[], activeCats, box, options, postsRet,
        //postsSort, coords, loc,
        curLocation, sortObj = { 'stats.seenTotal': -1 },
        serverLimit = 20;
    lat=request.lat;
    lng=request.lng;
    radius=request.radius;
    skip=request.skip;
    take = request.take || serverLimit;
    activeCats=request.activeCats;

    options = {
        sort: sortObj,
        skip: skip,
        limit: take
    };
    if (lat && lng && radius) {
      box = bz.bus.proximityHandler.getLatLngBox(lat, lng, radius);
      if (box) {
        postsQuery['details.locations'] = {
          $elemMatch: {
            'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
            'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
          }
        };
      }
    }else{

    }
    if (activeCats && Array.isArray(activeCats) && activeCats.length > 0) {
      postsQuery['type'] = { $in: activeCats };
    } else {
      arrTypes = _.map(bz.cols.postAdTypes.find().fetch(), function (item) {
        return item.name;
      });
      arrTypes.push(undefined);
      arrTypes.push('');
      postsQuery['type'] = { $in: arrTypes };
    }
    postsQuery['status'] ={ visible: bz.const.posts.status.visibility.VISIBLE };
    posts = bz.cols.posts.find(postsQuery, options).fetch();
    postsRet = bz.bus.postsHandler.buildPostsObject({ posts:posts });
    //postsRet = posts;
    ret={ success:true, result:postsRet };
    return ret;
  },
  deletePost: function(requestedPostId, currentUserId){
    var ret={},
      postDb=bz.cols.posts.findOne({_id: requestedPostId});
    if(postDb){
      if(postDb.userId===currentUserId){
        bz.cols.posts.remove(requestedPostId);
        ret={success:true};
      }else{
        //error
        ret={success:false,error:bz.const.errors.global.userNotAuthor};
      }
    }else{
      //error
      ret={success:false, error: bz.const.errors.global.dataNotFound};
    }
    return ret;
  }
};