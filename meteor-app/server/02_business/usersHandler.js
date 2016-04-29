/**
 * Created by xvolkx48 on 29.04.2016.
 */

bz.bus.getUser = function(id, userID){
  var ret, user, userFind, profileDetails, locations;
  userFind = Meteor.find({_id: id});
  if (id===userId){
    profileDetails=bz.cols.profileDetails.find({userId: id}).fetch();
    locations=bz.cols.locations.find({userId: id}).fetch();
    user={_id: userFind._id,
      createdAt: userFind.createdAt,
      username: userFind.username,
      emails: userFind.emails,
      online: userFind.online,
      imageUrl: userFind.profile.image.data(),
      language: userFind.language
    };
  }else{
    profileDetails=bz.cols.profileDetails.find({userId: id, policy: 1}).fetch();
    locations=[];
    user={id: userFind._id,
      createdAt: userFind.createdAt,
      username: userFind.username,
      online: userFind.online,
      imageUrl: userFind.profile.image.data(),
      language: userFind.language};
  }
  ret={user,profileDetails,locations};
  return ret;
};

bz.bus.editUser = function(){
  var ret;

  return ret;
};

bz.bus.addUser = function(){
  var ret;

  return ret;
};