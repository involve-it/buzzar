

/*Find contacts*/
Meteor.publish('users', function(){
    return Meteor.users.find();
});

/*
    Meteor.publish('contact', function(_id) {
        return Contacts.find({_id: _id});
    });
*/




