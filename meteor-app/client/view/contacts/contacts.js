/**
 * Created by douson on 10.07.15.
 */


Template.contacts.helpers({
    contacts: function() {
        var contacts = Meteor.users.find({_id: { $ne: Meteor.userId() }});

        return contacts;
        /*
        var currentUser = Meteor.user(),
            contacts;

        if(currentUser.contacts) {
            contacts = Meteor.users.find({_id: { $in: currUser.contacts }});
        }

        return contacts;
        */
    },
    feeling: function() {
        return Random.choice(['Happiness', 'Anger', 'Sadness', 'Surprise']);
    }
});

Template.contacts.events({
    'focus input[type=search]': function(e, tmpl) {
        var el = $('.button-search-contacts');

        el.css('display','block')
    },
    'blur input[type=search]':function(e, tmpl) {
        var el = $('.button-search-contacts');
        if(el) {
            //el.css('display','none');
        }
    }
});