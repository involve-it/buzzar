
Template.bzAvatarUserStatus.helpers({
  online: function() {
    var that = Meteor.users.findOne({_id: Meteor.userId()});
    if(that) {
      return that.online || false;
    }
  }
});