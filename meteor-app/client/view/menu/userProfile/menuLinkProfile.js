/**
 * Created by douson on 09.07.15.
 */

Template.slideMenuUserProfile.created = function() {

};









Template.slideMenuUserProfile.helpers({
    user: function () {
        if (Meteor.userId()) {
            return Meteor.users.find();
        }
    },
    showUserName: function() {
        var user = Meteor.users.findOne({_id: Meteor.userId()}),
            firstName = user.profile.firstName || '',
            lastName = user.profile.lastName || '';
        
        var username =  firstName + " " + lastName || user.username,
            LIMIT = 25,
            result = [];

        for(var i = 0; i < LIMIT; i++) {
            result.push(username[i]);
        }
        result = result.join('');
        if(username.length > LIMIT) {
            return result + "...";
        } else {
            return result;
        }
        
        
    }

});
