/**
 * Created by douson on 29.07.15.
 */

Template.settingsEdit.onCreated(function() {
    return Meteor.subscribe('users', Router.current().params._id);
});

Template.settingsEdit.helpers({
    contact: function () {
        return Meteor.users.findOne({_id: Router.current().params._id});
    }
});