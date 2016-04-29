/**
 * Created by xvolkx48 on 29.04.2016.
 */

function getUser(id) {
  var ret = bz.bus.getUser(id, Meteor.userId());
  return ret;
}
function editUser() {
  var ret = bz.bus.editUser();
  return ret;
}
function addUser() {
  var ret = bz.bus.addUser();
  return ret;
}