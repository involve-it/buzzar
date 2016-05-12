/**
 * Created by xvolkx48 on 29.04.2016.
 */

bz.bus.usersHandler = {
    getUser: function (requestedUserId, currentUserId) {
        var user, arrProfileDetails,profileDetails=[], ret={},
            userDb = Meteor.users.findOne({_id: requestedUserId});
        if (userDb) {
          user = {
            _id: userDb._id,
            createdAt: userDb.createdAt,
            username: userDb.username,
            online: userDb.online,
            image:{
              imageUrl: userDb.profile && userDb.profile.image && userDb.profile.image.data,
              thumbnail: userDb.profile && userDb.profile.image && userDb.profile.image.data && userDb.profile.image.thumbnail
            }
          };
          if (requestedUserId === currentUserId) {
            arrProfileDetails = bz.cols.profileDetails.find({userId: requestedUserId}).fetch();

            user.locations = bz.cols.locations.find({userId: requestedUserId}).fetch();
            user.emails = userDb.emails;
            user.language = userDb.profile && userDb.profile.language;
          } else {
            arrProfileDetails = bz.cols.profileDetails.find({userId: requestedUserId, policy: "1"}).fetch();
          }
          _.each(arrProfileDetails,function(item){
            profileDetails.push({
              key: item.key,
              value: item.value,
              policy: item.policy
            })
          });
          user.profileDetails = profileDetails;
          ret={success:true, result: user};
        }else{
            ret={success:false, error: bz.const.errors.global.dataNotFound}
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
                    if (item.key && (item.key in bz.const.verification.profileDetailsKeys)) {
                        profileDetails.push({
                            key: item.key,
                            value: item.value,
                            policy: item.policy
                        });
                    }
                });
            } else {
                //error
                ret = {success: false, error: bz.const.errors.users.badProfileDetails}
            }
        }
        if(requestEmail) {
            if (bz.const.RegExp.emaileRegEx.test(requestEmail)) {
                email = requestEmail;
            }
            else {
                //error
                ret = {success: false, error: bz.const.errors.users.badEmail}
            }
        }
        if (requestImageUrl) {
            if (bz.const.RegExp.imageUrlRegEx.test(requestImageUrl)) {

            } else {
                //error
                ret = {success: false, error: bz.const.errors.users.badImageUrl}
            }
        }
        if (userDb) {
            if(profileDetails.length>0){
                _.each(profileDetails, function(profileDetail){
                    bz.cols.profileDetails.update({userId:currentUserId},
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
            ret={success:false, error: bz.const.errors.global.internalError}
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
    }
};