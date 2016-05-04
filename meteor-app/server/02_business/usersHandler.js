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
    editUser: function () {

    },
    addUser: function () {

    }
};