/**
 * Created by arutu_000 on 10/20/2015.
 * // for references see this :
 * see meteor add dburles:collection-helpers
 * https://atmospherejs.com/dburles/collection-helpers
 *
 */

var usersCol = Meteor.users;
bz.help.makeNamespace('bz.help.users', {
  //removed as it is not a necessity
  /*_isOnline: function () {
   var ret;
   if(this.online){
   ret = this.online;
   }
   return ret;
   },*/
  _getAvatarImage: function () {
    var ret;
    if (this.profile && this.profile.image) {
      ret = this.profile.image.data;
    }
    return ret;
  },
  _getLanguage: function () {
    var ret;
    ret = this.profile && this.profile.language;
    return ret;
  },
  isAdmin: function () {
    return (this.profile && this.profile.isAdmin) ? true : false;
  },
  isAdminRole: function () {
    return (this.profile && (this.profile.role === 'admin' || this.profile.role === 'hero')) ? true : false;
  },
  postBelongsToUser: function (post) {
    var ret = false, userId;
    if (post && (post.user || post.userId)) {
      var postOwnerId = post.user && post.user._id || post.userId; //old style..
      userId = this._id;
      ret = postOwnerId && (postOwnerId === userId);
    }
    return ret;
  },
  getUserThumb: function () {
    var user = this, ret, imgObj = user && (user.profile && user.profile.image || user.image);  // user.image - some weird format , sometimes passed from method 'getUser'..
    if (imgObj) {
      ret = imgObj.thumbnail || imgObj.data || imgObj.imageUrl; // imageUrl - same , format mess
    }
    ret = ret || '/img/content/avatars/avatar-no.png';
    return ret;
  }
});

usersCol.helpers(bz.help.users);

