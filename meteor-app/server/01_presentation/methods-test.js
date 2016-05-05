/**
 * Created by xvolkx48 on 29.04.2016.
 */
Meteor.methods({
  getUser:function(userId) {
    return bz.bus.usersHandler.getUser(userId, Meteor.userId());
  },
  editUser: function(profileDetails,imageUrl, emails){
    return bz.bus.usersHandler.editUser(profileDetails,imageUrl, emails, Meteor.userId());
  },
  addUser: function(user){
    return  bz.bus.usersHandler.addUser(user);
  }
});