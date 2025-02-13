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
      {'details.title': {$regex: query, $options: 'i'}},
      {'details.description': {$regex: query, $options: 'i'}},
      {'details.price': {$regex: query}}
    ];
    postsQuery['status'] ={visible: bz.const.posts.status.visibility.VISIBLE};
    // get only non-expired posts (if no value provided in call):
    if (!postsQuery['endDatePost']) {
      postsQuery['endDatePost'] = { $gte : new Date() }
    }

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
    var ret={},post, newPost, postData, validate, locations=[];
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
                thumbnail: e.thumbnail || e.data
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
          timestamp: new Date(),
          endDatePost: new Date(postData.endDatePost)
        };
        if (postData.type=='jobs' && postData.jobsDetails){
          newPost.jobsDetails={
            seniority: postData.jobsDetails.seniority,
            gender: postData.jobsDetails.gender,
            contacts: postData.jobsDetails.contacts,
            attachment: postData.jobsDetails.attachment,
            typeCategory: postData.jobsDetails.typeCategory,
            jobsType: postData.jobsDetails.jobsType,
            payMethod: postData.jobsDetails.payMethod};
        }else if(postData.type=='trainings' && postData.trainingsDetails) {
          newPost.trainingsDetails = {
            sectionLearning: postData.trainingsDetails.sectionLearning,
            typeCategory: postData.trainingsDetails.typeCategory
          };
        }
        if (postData.details && postData.details.locations) {
          _.each(postData.details.locations, function(location){
            if (location.placeType === bz.const.locations.type.DYNAMIC){
              location.obscuredCoords = bz.bus.proximityHandler.getObscuredCoords(location.coords, 0.1);
            } else {
              location.obscuredCoords = location.coords;
            }
          });
          _.each(postData.details.locations, function(location){
            var loc ={
              userId: location.userId,
              name:location.name,
              accurateAddress:location.accurateAddress,
              coords:location.coords,
              placeType:location.placeType,
              public:location.public,
              _id:location._id,
              obscuredCoords: location.obscuredCoords
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
                  photos: postDb.details.photos,
                  other: postData.details.other
                },
                lastEditedTs: new Date(now)
              };
              if (postData.type){
                updatePost.type = postData.type;
              }
              if (postData.endDatePost){
                updatePost.endDatePost = new Date(postData.endDatePost);
              }
              //mobile format
              if (postDb.details.photos) {
                bz.cols.images.remove({_id: {$in: postDb.details.photos}});
              }
              if (postData.details && postData.details.photos && postData.details.photos.length > 0 && typeof postData.details.photos[0] === 'object'){
                var photoIds = [], photo;

                postData.details.photos.forEach(function(e){
                  if (e.data) {
                    photo = {
                      userId: currentUserId,
                      name: null,
                      data: e.data,
                      thumbnail: e.thumbnail || e.data
                    };
                    photoIds.push(bz.cols.images.insert(photo));
                  }
                });
                updatePost.details.photos = photoIds;
              } else {
                  updatePost.details.photos = postData.details.photos || [];
              }
              if (postData.status){
                updatePost.status = postData.status
              }
              if (postData.type=='jobs' && postData.jobsDetails){
                updatePost.jobsDetails={
                  seniority: postData.jobsDetails.seniority,
                  gender: postData.jobsDetails.gender,
                  contacts: postData.jobsDetails.contacts,
                  attachment: postData.jobsDetails.attachment,
                  typeCategory: postData.jobsDetails.typeCategory,
                  jobsType: postData.jobsDetails.jobsType,
                  payMethod: postData.jobsDetails.payMethod};
              }else if(postData.type=='trainings' && postData.trainingsDetails) {
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
    var post,posts,postsRet=[], ret=[], locations=[],arrPhoto, photos,usersIds, arrUsers, users, likes;
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
        return (a || []).concat(b || []);
      }).filter(function(p) { return !!p; });
      if (arrPhoto.length > 0) {
        photos = bz.bus.imagesHandler.getPhotos(arrPhoto);
      }
      var postIds = _.pluck(posts, '_id');

      likes = bz.cols.likes.find({entityId: {$in: postIds}, entityType: 'post'}).fetch();
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
          timestamp: new Date(postDb.timestamp),
          timePause: new Date(postDb.timePause),
          endDatePost: new Date(postDb.endDatePost),
          social: postDb.social,
          stats: postDb.stats,
          lastEditedTs: new Date(postDb.lastEditedTs),
          likes: _.filter(likes, function(like){ return like.entityId === postDb._id}).length,
          premium: postDb.premium
        };
        if (Meteor.userId()){
          post.liked = !!_.find(likes, function(like){return like.entityId === postDb._id && like.userId === Meteor.userId()});
        }
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
  getNearbyPosts: function(request, showOffline){
    var ret, lat, lng, radius, skip, take, postsQuery={}, posts, arrTypes=[], activeCats, box, postsRet, postsSort, coords, loc,
        curLocation,
        serverLimit = 20, options, optionsForArray, onlineOnlyQuery;
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
      skip: skip
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
    // get only non-expired posts (if no value provided in call):
    if (!postsQuery['endDatePost']) {
      postsQuery['endDatePost'] = { $gte : new Date() }
    }
    // only return live posts, if no showOffline flag provided:
    if (showOffline) {
      posts = bz.cols.posts.find({$or: [postsQuery, {'premium': 1}]}, options).fetch().sort(optionsForArray.sort).slice(0, take);
    } else {
      postsQuery["$or"] = [{"presences.dynamic": {'$eq': 'close'}}, {"presences.static": {'$eq': 'close'}}];
      try {
        posts = bz.cols.posts.aggregate([
          // {$match: {"$or": [{"presences.dynamic": {'$eq': 'close'}}, {"presences.static": {'$eq': 'close'}}]}},
          {$match: {$or: [postsQuery, {'premium': 1}]}},
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userObject"
            }
          },
          {
            $match: {"$or": [{"userObject.0.status.online": true}, {"userObject.0.status.onlineFake": true} ] }
          }
        ]);
      } catch(ex) {
        console.log(ex);
      }
    }
    postsRet = bz.bus.postsHandler.buildPostsObject({ posts:posts });
    //postsRet = posts;
    if (postsRet){
      postsRet.forEach(function(post){
        if (post.premium && post.details && post.details.locations && post.details.locations.length){
          post.details.locations[0].coords = {
            lat: request.lat,
            lng: request.lng
          }
        }
      });
    }
    if (postsRet && typeof postsRet.sort === 'function') {
      postsRet = postsRet.sort(optionsForArray.sort).slice(0, take);
    }

    ret = { success:true, result:postsRet };
    return ret;
  },
    getNearbyPostsByCityAndLocation: function(request, showOffline){ // добавим проверку на местоположение, если оно не определилось, покажем город:
    var ret, lat, lng, radius, skip, take, postsQuery={}, posts, arrTypes=[], activeCats, box, postsRet, postsSort, coords, loc,
        curLocation,
        serverLimit = 20, options, optionsForArray, onlineOnlyQuery, userId, city;
    lat=request.lat;
    lng=request.lng;
    radius=request.radius; //request.radius;
    skip=request.skip;
    take=request.take || serverLimit;
    activeCats=request.activeCats;
    userId = request.userId;
    city = request.city;
    if(lat && lng && lat !== 0 && lng !== 0) {
      curLocation = {
        coords: {
          lat: lat,
          lng: lng
        }
      }
    } else if(city || userId) {
      // set city:
        !city && Meteor.users.findOne(userId) && (city = Meteor.users.findOne(userId).profile.city);

        var cityObj = bz.cols.cities.findOne({ name: city });
        if (cityObj) {
            curLocation = {
                coords: {
                    lat: cityObj.location.coordinates[0],
                    lng: cityObj.location.coordinates[1]
                }
            }

        }

    } else {
      // no user id, nothing!!
    }
    options = {
      sort: { 'stats.seenTotal': -1 },
      skip: skip
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
    // get only non-expired posts (if no value provided in call):
    if (!postsQuery['endDatePost']) {
      postsQuery['endDatePost'] = { $gte : new Date() }
    }
    // only return live posts, if no showOffline flag provided:
      //postsQuery["$or"] = [{"presences.dynamic": {'$eq': 'close'}}, {"presences.static": {'$eq': 'close'}}];
      try {
          posts = bz.cols.posts.find({$or: [postsQuery, {'premium': 1}]}, options).fetch().sort(optionsForArray.sort).slice(0, take);

          /* posts = bz.cols.posts.aggregate([
              {$match: {"$or": [{"presences.dynamic": {'$eq': 'close'}}, {"presences.static": {'$eq': 'close'}}]}},
             { $match: postsQuery },
             {
               $lookup: {
                 from: "users",
                 localField: "userId",
                 foreignField: "_id",
                 as: "userObject"
               }
             },
             {
               //$match: {"$or": [{"userObject.0.status.online": true}, {"userObject.0.status.onlineFake": true} ] }
             }
           ]);*/
      } catch(ex) {
        console.log(ex);
      }
    postsRet = bz.bus.postsHandler.buildPostsObject({ posts:posts });
    //postsRet = posts;
    if (postsRet){
      postsRet.forEach(function(post){
        if (post.premium && post.details && post.details.locations && post.details.locations.length){
          post.details.locations[0].coords = {
            lat: request.lat,
            lng: request.lng
          }
        }
      });
    }
    if (postsRet && typeof postsRet.sort === 'function') {
      postsRet = postsRet.sort(optionsForArray.sort).slice(0, take);
    }

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

    // get only non-expired posts (if no value provided in call):
    if (!postsQuery['endDatePost']) {
      postsQuery['endDatePost'] = { $gte : Date.now() }
    }
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
