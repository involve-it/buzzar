/**
 * Created by xvolkx48 on 29.04.2016.
 */

bz.bus.usersHandler = {
    getUser: function (requestedUserId, currentUserId) {
        var user, profileDetails,
            userDb = Meteor.users.findOne({_id: requestedUserId});
        if (userDb) {
            user = {
                _id: userDb._id,
                createdAt: userDb.createdAt,
                username: userDb.username,
                online: userDb.online,
                imageUrl: userDb.profile && userDb.profile.image && userDb.profile.image.data
            };
            if (requestedUserId === currentUserId) {
                profileDetails = bz.cols.profileDetails.find({userId: requestedUserId}).fetch();
                user.locations = bz.cols.locations.find({userId: requestedUserId}).fetch();
                user.emails = userDb.emails;
                user.language = userDb.profile && userDb.profile.language;
            } else {
                profileDetails = bz.cols.profileDetails.find({userId: requestedUserId, policy: 1}).map(function(profile){
                    return {
                        key: profile.key,
                        value: profile.value
                    };
                });
            }
            user.profileDetails = profileDetails;
        }
        return user;
    },
    editUser: function (requestProfileDetails, requestImageUrl, requestEmails, currentUserId) {
        var profileDetails=[], emails=[], user,
            userDb = Meteor.users.findOne({_id: currentUserId});
        var emaileRegEx =/[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}/i;
        var imageUrlRegEx=/^(https:\/\/buzzar.s3-us-west-1.amazonaws.com\/v1.0\/public\/images\/)[A-Z0-9.-]+/i;
        if (Array.isArray(requestProfileDetails)) {
            _.each(requestProfileDetails, function (item) {
                if (item.key) {
                    profileDetails.push({
                        key: item.key,
                        value: item.value,
                        policy: item.policy
                    });
                }
            });
        }else {
            //error
            return {success:false, error: bz.const.errors.users.badProfileDetails.errorId}
        }
        if (Array.isArray(requestEmails)) {
            _.each(requestEmails, function (item) {
                if ( item && emaileRegEx.test(item)) {
                    emails.push({address: item.address});
                }
                else{
                    //error
                    return {success:false, error: bz.const.errors.users.badEmails.errorId}
                }
            });
        }
        else{
            //error
            return {success:false, error: bz.const.errors.users.badEmails.errorId}
        }
        if (requestImageUrl && imageUrlRegEx.test(requestImageUrl)){

        }else{
            //error
            return {success:false, error: bz.const.errors.users.badImageUrl.errorId}
        }
        if (userDb) {
            if(profileDetails.length>0){
                _.each(profileDetails, function(profileDetail){
                    bz.cols.profileDetails.update({userId:currentUserId,key: profileDetail.key},
                      {$set: profileDetail},
                      {upsert: true}
                    );
                })
            }
            if(requestImageUrl || emails.length>0){
                if (requestImageUrl){
                    user.profile = {image:{ data: requestImageUrl}}
                }
                if (emails.length>0){
                    _.each(emails, function (email) {
                        user.emails={address:email.address};
                    })
                }
                Meteor.users.update({_id:currentUserId},{$set: user})
            }
            return {success: true}
        }
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
            console.log(ex)
            throw new Meteor.Error(403, ex.message);
        }
    }
};