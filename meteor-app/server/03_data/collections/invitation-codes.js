/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {
    // code types
    bz.cols.invitationCodeTypes = new Mongo.Collection('invitationCodeTypes');
    bz.cols.invitationCodeTypes.remove({});
    bz.cols.invitationCodeTypes.insert({
        name: 'global',
    });
    bz.cols.invitationCodeTypes.insert({
        name: 'clubAdmin'
    });
    bz.cols.invitationCodeTypes.insert({
        name: 'trainer'
    });
    bz.cols.invitationCodeTypes.insert({
        name: 'event'
    });

  //сами коды (создадим пару глобальных)
    bz.cols.invitationCodes = new Mongo.Collection('invitationCodes');
    bz.cols.invitationCodes.remove({});
    // we add id's so that it's consistent:
debugger;
console.log('imhere!!!!');
    bz.cols.invitationCodes.insert({
        issuerId: Meteor.users.findOne({ 'emails.0.address': 'arutune@gmail.com'})._id,
        codeType: bz.cols.invitationCodeTypes.findOne({ name: 'global' }),

    });


});
