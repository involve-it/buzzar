/**
 * Created by xvolkx48 on 29.04.2016.
 */
Meteor.methods({
  getUser:function(userId) {
    return bz.bus.usersHandler.getUser(userId, Meteor.userId());
  }
});