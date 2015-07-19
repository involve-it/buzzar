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
        var username = 'Вячеслав Александров',
            LIMIT = 20,
            result = [];

        for(var i = 0; i < LIMIT; i++) {
            result.push(username[i]);
        }

        result = result.join('');

        return result;
    }

});
