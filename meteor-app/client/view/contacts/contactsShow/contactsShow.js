/**
 * Created by douson on 10.07.15.
 */

Template.contactsShow.helpers({
    contact: function () {
        return Meteor.users.findOne({_id: Router.current().params._id});
    }
});

Template.contactsShow.events({
    'click': function (event, template) {
        event.preventDefault();
    }
});