/**
 * Created by arutu_000 on 1/17/2017.
 */

Template.invitationCodes.rendered = function () {
};

Template.invitationCodes.helpers({
    getCodes: function() {
        return bz.cols.invitationCodes.find().fetch();
    }
});
Template.invitationCodes.events({
    'click #generateInvitationCode': function() {
        $('[data-reveal].js-create-code-modal-holder').foundation('reveal', 'open');
    }
});

Template.invitationCodesItem.rendered = function () {
};
Template.invitationCodesItem.helpers({
});
Template.invitationCodesItem.events({
    'click .js-remove': function (e, el) {
        bz.cols.invitationCodes.remove(this._id);
    }
});
Template.bzCreateInvitationCodeModal.events({
    'click .js-create-code-button': function(e, view) {
        var code;
        code = bz.bus.invitationCodes.createCode({
            trainerName: view.$('.js-trainer-name-input').val(),
            eventName: view.$('.js-event-name-input').val(),
            issuerId: Meteor.userId()
        });
        view.$('.js-create-code-button').hide();
        view.$('.js-create-code-code-holder').show().text(code);
        view.$('.js-create-code-close-button').show();
    },
    'click .js-create-code-close-button': function() {
        $('[data-reveal].js-create-code-modal-holder').foundation('reveal', 'close');
    }
});

bz.help.makeNamespace('bz.bus.invitationCodes');
bz.bus.invitationCodes.createCode = function(data){
    var ret;
    ret = bz.cols.invitationCodes.insert(data);
    return ret;
}