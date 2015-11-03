/**
 * Created by arutu_000 on 10/20/2015.
 * // for references see this :
 * see meteor add dburles:collection-helpers
 * https://atmospherejs.com/dburles/collection-helpers
 *
 */

var usersCol = Meteor.users;
usersCol.helpers({
  //removed as it is not a necessity
  /*_isOnline: function () {
    var ret;
    if(this.online){
      ret = this.online;
    }
    return ret;
  },*/
  _getAvatarImage: function (userId) {
    var ret;
    if (this.profile && this.profile.image) {
      ret = this.profile.image.data;
    }
    return ret;
  }
});

