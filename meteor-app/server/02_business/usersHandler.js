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
        if (requestImageUrl) {
            if (bz.const.RegExp.imageUrlRegEx.test(requestImageUrl)) {

            } else {
              //error
              ret = {success: false, error: bz.const.errors.users.badImageUrl};
              return ret;
            }
        }
        if (userDb) {
            if(profileDetails.length>0){
                _.each(profileDetails, function(profileDetail){
                    bz.cols.profileDetails.update({userId:currentUserId, key: profileDetail.key},
                      {$set: profileDetail},
                      {upsert: true}
                    );
                })
            }
            if(requestImageUrl || email){
                if (requestImageUrl){
                    user.profile = {image:{ data: requestImageUrl, thumbnail: null}}
                }
                if (email){
                    user.emails={address:email};
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
                userId = Accounts.createUser({email: user.email, password: user.password, profile: _.extend(profile, user.profile)});
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
  buildUserObject: function(data){
    var ret={},users, usersRet=[], user, arrProfileDetails,profileDetails=[],tempArrprofileDetails,
      currentUserId=Meteor.userId();
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
        online: userDb.status.online,
        image:{
          imageUrl: userDb.profile && userDb.profile.image && userDb.profile.image.data,
          thumbnail: userDb.profile && userDb.profile.image && userDb.profile.image.data && userDb.profile.image.thumbnail
        },
        lastMobileLocationReport: userDb.lastMobileLocationReport
      };
      if (userDb._id === currentUserId) {
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
  }
};