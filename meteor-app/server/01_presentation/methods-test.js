/**
 * Created by xvolkx48 on 29.04.2016.
 */

function getUser(userId) {
  return bz.bus.usersHandler.getUser(userId, Meteor.userId());
}
function editUser() {
  var ret = bz.bus.usersHandler.editUser();
  return ret;
}
function addUser() {
  var ret = bz.bus.usersHandler.addUser();
  return ret;
}