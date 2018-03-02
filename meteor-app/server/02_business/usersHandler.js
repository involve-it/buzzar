/**
 * Created by xvolkx48 on 29.04.2016.
 */

bz.bus.usersHandler = {
    getUser: function (requestedUserId, currentUserId) {
        var user, ret={},
            userDb = bz.bus.usersHandler.userDbQuery([requestedUserId]);
        if (userDb) {
            user=bz.bus.usersHandler.buildUserObject(userDb)[0];
          ret={success:true, result: user};
        }else{
          //error
          ret={success:false, error: bz.const.errors.global.dataNotFound};
          return ret;
        }
        return ret;
    },
    getUserByName: function (username) {
      var ret = {success: false, error: bz.const.errors.global.dataNotFound};
      var user = Meteor.users.findOne({username:username});
      if (user) {
        var profileDetails = bz.bus.usersHandler.profileDetailsDbQuery([user._id]);
        var userDb = {users: [user], profileDetails: profileDetails};

        if (userDb) {
          user = bz.bus.usersHandler.buildUserObject(userDb)[0];
          ret = {success: true, result: user};
        }
      }
      return ret;
    },
    editUser: function (requestData, currentUserId) {
        var requestProfileDetails,requestImageUrl,requestEmail,profileDetails=[], email, user={},ret={},
            userDb = Meteor.users.findOne({_id: currentUserId});
        requestProfileDetails=requestData.profileDetails;
        requestEmail=requestData.email;
        requestImageUrl=requestData.imageUrl;
        if (requestProfileDetails) {
            if (Array.isArray(requestProfileDetails)) {
                _.each(requestProfileDetails, function (item) {
                    if (item.key && (bz.const.verification.profileDetailsKeys.indexOf(item.key)!==-1)) {
                        profileDetails.push({
                            key: item.key,
                            value: item.value,
                            policy: item.policy
                        });
                    }
                });
            } else {
              //error
              ret = {success: false, error: bz.const.errors.users.badProfileDetails};
              return ret;
            }
        }
        if(requestEmail) {
            if (bz.const.RegExp.emaileRegEx.test(requestEmail)) {
                email = requestEmail;
            }
            else {
              //error
              ret = {success: false, error: bz.const.errors.users.badEmail};
              return ret;
            }
        }
        /*if (requestImageUrl) {
            if (bz.const.RegExp.imageUrlRegEx.test(requestImageUrl) || bz.const.RegExp.imageUrlRegEx2.test(requestImageUrl)) {

            } else {
              //error
              ret = {success: false, error: bz.const.errors.users.badImageUrl};
              return ret;
            }
        }*/
        if (userDb) {
            if(profileDetails.length>0){
                _.each(profileDetails, function(profileDetail){
                    bz.cols.profileDetails.update({userId:currentUserId, key: profileDetail.key},
                      {$set: profileDetail},
                      {upsert: true}
                    );
                })
            }
            if (requestData.enableNearbyNotifications != null){
              user.enableNearbyNotifications = requestData.enableNearbyNotifications;
            }
            if (requestData.isInvisible != null){
                user.isInvisible = requestData.isInvisible;
                if (user.isInvisible){
                    user.lastMobileLocationReport = null;
                }
            }
            if(requestImageUrl || email){
                if (requestImageUrl){
                    user.profile = {image:{ data: requestImageUrl, thumbnail: null}}
                }
                if (email){
                    user.emails=[{address:email, verified: false}];
                }
                Meteor.users.update({_id:currentUserId},{$set: user})
            }
            ret = {success: true}
        }else{
          //error
          ret={success:false, error: bz.const.errors.global.internalError};
          return ret;
        }
        return ret;
    },
    addUser: function (user) {
        var profile, userId;
        try{
            check(user, Object);
            profile = AccountsEntry.settings.defaultProfile || {};

            if (user.username) {
                userId = Accounts.createUser({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    profile: _.extend(profile, user.profile)
                });
            } else {
                userId = Accounts.createUser({email: user.email, password: user.password, profile: _.extend(profile, user.profile), enableNearbyNotifications: true});
            }

            if (userId){
              Meteor.users.update({_id: userId}, {$set: {enableNearbyNotifications: true}});
            }

            if (user.email && Accounts._options.sendVerificationEmail) {
                Accounts.sendVerificationEmail(userId, user.email);
            }
            return {success: true}
        }catch(ex){
            console.log(ex);
            throw new Meteor.Error(403, ex.message);
        }
    },
  userDbQuery: function (usersId){
    var ret={},users,profileDetails;
    users=Meteor.users.find({_id:{$in: usersId}}).fetch();
    profileDetails=bz.bus.usersHandler.profileDetailsDbQuery(usersId);
    ret={users: users, profileDetails: profileDetails};
    return ret;
  },
  profileDetailsDbQuery: function(userIds){
    var ret,profileDetails;
    profileDetails=bz.cols.profileDetails.find({userId: {$in: userIds}}).fetch();
    ret=profileDetails;
    return ret;
  },
  buildUserObject: function(data, userId){
    var ret={},users, usersRet=[], user, arrProfileDetails,profileDetails=[],tempArrprofileDetails,
      currentUserId=userId || Meteor.userId();
    users=data.users;
    arrProfileDetails=data.profileDetails;
    _.each(users,function(userDb){
      profileDetails=[];
      tempArrprofileDetails=[];
        console.log(userDb.online);
        user = {
        _id: userDb._id,
        createdAt: userDb.createdAt,
        username: userDb.username,
        online: userDb.status.online && !userDb.isInvisible,
        isInvisible: !!userDb.isInvisible,
        lastLogin: userDb.status && userDb.status.lastLogin && userDb.status.lastLogin.date,
        profile:{
            city: userDb.profile.city,
            inviteCode: userDb.profile.inviteCode,
            phone: userDb.profile.phone,
            role: userDb.profile.role
        },
        image:{
          imageUrl: userDb.profile && userDb.profile.image && userDb.profile.image.data,
          thumbnail: userDb.profile && userDb.profile.image && userDb.profile.image.data && userDb.profile.image.thumbnail
        },
        lastMobileLocationReport: userDb.lastMobileLocationReport
      };
      if (userDb._id === currentUserId) {
        user.enableNearbyNotifications = userDb.enableNearbyNotifications;
        user.emails = userDb.emails;
        tempArrprofileDetails=_.filter(arrProfileDetails,function(item){return item.userId==userDb._id});
      }else{
        tempArrprofileDetails=_.filter(arrProfileDetails,function(item){return item.userId==userDb._id && item.policy=="1"});
      }
      _.each(tempArrprofileDetails,function(item){
        profileDetails.push({
          key: item.key,
          value: item.value,
          policy: item.policy
        })
      });
      user.profileDetails = profileDetails;
      usersRet.push(user);
    });
    ret=usersRet;
    return ret;
  },
  getNearbyUsers: function(request){
    var ret, lat, lng, radius, skip, take, query={}, posts, arrTypes=[], activeCats, box, postsRet, postsSort, coords, loc,
      curLocation, options, optionsForArray, isHappyville = false;
    lat=request.lat;
    lng=request.lng;
    radius=request.radius || bz.const.search.AROUND_YOU_RADIUS; //request.radius;
    skip=request.skip;
    take=request.take || bz.const.search.AROUND_YOU_LIMIT;
    activeCats=request.activeCats;
    bz.log('lat: ' + lat + ', lng: ' + lng, 'getNearbyUsers');

    if (!lat || !lng) {
      isHappyville = true;
      lat = bz.const.search.DEFAULT_PLACE.lat;
      lng = bz.const.search.DEFAULT_PLACE.lng;
    }
    if(lat && lng) {
      curLocation = {
          lat: lat,
          lng: lng
      }
    }
    options = {
      // sort: { 'stats.seenTotal': -1 },
      skip: skip
    };
    optionsForArray = {
      sort: function(a, b) {
        var diff = 0;
        var coordsA = a.coords;
        var coordsB = b.coords;

        if (coordsA && coordsA.lat && coordsA.lng) {

        } else {

          diff = 100000;
          return diff;
        }
        if (coordsB && coordsB.lat && coordsB.lng) {

        } else {
          diff = 0;

          return diff;
        }

        diff = bz.help.location.getDistance(coordsA.lat, coordsA.lng, curLocation.lat, curLocation.lng);
         - bz.help.location.getDistance(coordsB.lat, coordsB.lng, curLocation.lat, curLocation.lng);
        // var diff = bz.help.posts.getDistanceToCurrentLocationNumber.call(a, undefined, curLocation)
        //   - bz.help.posts.getDistanceToCurrentLocationNumber.call(b, undefined, curLocation);
        return diff;
      }
    };
    if (lat && lng && radius) {
      box = bz.bus.proximityHandler.getLatLngBox(lat, lng, radius);
      if (box) {
        query['coords.lat'] = { $gte: box.lat1, $lte: box.lat2 };
        query['coords.lng'] = { $gte: box.lng1, $lte: box.lng2 }
      }
    } else {

    }

    query['status.online'] = true;
    posts = Meteor.users.find(query, options).fetch().sort(optionsForArray.sort).slice(0, take);
    // postsRet = bz.bus.postsHandler.buildPostsObject({ posts:posts });
    ret = posts;

    return ret;
  },
};