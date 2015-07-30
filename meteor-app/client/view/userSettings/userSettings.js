/**
 * Created by douson on 09.07.15.
 */

Template.userSettings.onCreated(function() {
    
    
});

Template.userSettings.helpers({
    username: function() {
        // username of logged in user
        var user = Meteor.users.findOne({_id: Meteor.userId()} );
        return user && user.username;
    },
    getIdProfile: function () {
        //console.log('ID профайла пользователя ' + this._id);
        return this._id;
    },
    getIdGuestUser: function() {
        //console.log('ID гостя ( залогиненного ) ' + Meteor.userId());
        return Meteor.userId();
    }
});




Template.userSettings.events({
    
});