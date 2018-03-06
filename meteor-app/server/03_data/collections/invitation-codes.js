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
        name: 'admin'
    });
    bz.cols.invitationCodeTypes.insert({
        name: 'trainer'
    });
    bz.cols.invitationCodeTypes.insert({
        name: 'user'
    });
    bz.cols.invitationCodeTypes.insert({
        name: 'event'
    });

  //сами коды (создадим пару глобальных)
    bz.cols.invitationCodes = new Mongo.Collection('invitationCodes');

    var usr = Meteor.users.findOne({'emails.0.address': 'arutune@gmail.com'});
    var usrId = usr && usr._id;

    // we add id's so that it's consistent:
    if (!bz.cols.invitationCodes.findOne({ note: 'defaultGlobal' })) {
        bz.cols.invitationCodes.insert({
            issuerId: usrId || 0, // system
            codeType: bz.cols.invitationCodeTypes.findOne({name: 'global'}),
            note: 'defaultGlobal'
        });
    }
    // add one default admin code:
    if (!bz.cols.invitationCodes.findOne({ note: 'defaultAdmin' })) {
        bz.cols.invitationCodes.insert({
            issuerId: usrId || 0, // system
            codeType: bz.cols.invitationCodeTypes.findOne({name: 'admin'}),
            note: 'defaultAdmin'
        });
    }
    // add one default trainer code:
    if (!bz.cols.invitationCodes.findOne({ note: 'defaultTrainer' })) {
        bz.cols.invitationCodes.insert({
            issuerId: usrId || 0, // system
            codeType: bz.cols.invitationCodeTypes.findOne({name: 'trainer'}),
            note: 'defaultTrainer'
        });
    }
    // add one default user code:
    if (!bz.cols.invitationCodes.findOne({ note: 'defaultUser' })) {
        bz.cols.invitationCodes.insert({
            issuerId: usrId || 0, // system
            codeType: bz.cols.invitationCodeTypes.findOne({name: 'user'}),
            note: 'defaultUser'
        });
    }

    Meteor.publish('invitationCodes', function(){
        var ret;
        ret = bz.cols.invitationCodes.find();
        return ret;
    });
    bz.cols.invitationCodes.allow({
        insert: function () {
            return Meteor.user();
        },
        remove: function () {
            return Meteor.user();
        }
    });

});
