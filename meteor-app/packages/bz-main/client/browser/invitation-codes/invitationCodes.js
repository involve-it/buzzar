/**
 * Created by arutu_000 on 1/17/2017.
 */


Template.bzInvitationCodes.helpers({
    getCodes: function() {
        return bz.cols.invitationCodes.find().fetch();
    }
});
Template.bzInvitationCodes.events({
    'click #generateInvitationCode': function() {
        $('[data-reveal].js-create-code-modal-holder').foundation('reveal', 'open');
    }
});

Template.invitationCodesItem.rendered = function () {
};
Template.invitationCodesItem.helpers({
    getCode: function() {
        return bz.bus.invitationCodes.getCodeAlias(this);
    }
});
Template.invitationCodesItem.events({
    'click .js-remove': function (e, el) {
        if (this.note.indexOf('default') != 0) {
            bz.cols.invitationCodes.remove(this._id);
        } else {
            bz.ui.alert('Эти значения нельзя удалить');
        }
    }
});


Template.bzCreateInvitationCodeModal.created = function () {

    Meteor.subscribe('bz.cities');
    Meteor.subscribe('bz.users.trainers');
}
Template.bzCreateInvitationCodeModal.helpers({
    citiesArray: function () {
        var ret = bz.cols.cities.find().fetch().map(function (object) {
            return {
                id: object._id,
                value: object.ru,
            };
        });
        // var ret = bz.cols.cities.find().fetch().map(it=>it.name);
        return ret;
    },
    usersArray: function() {
        var ret = Meteor.users.find({ 'profile.type': 'trainer' }).fetch().map(function (object) {
            return {
                id: object._id,
                value: object.profile.name || object.username || object._id,
            };
        });
        // var ret = bz.cols.cities.find().fetch().map(it=>it.name);
        return ret;
    },
    rolesArray: function() {
        var ret = ['Тренер', 'Посетитель', 'Админ'].map(function (object) {
            return {
                id: object._id,
                value: object,
            };
        });
        // var ret = bz.cols.cities.find().fetch().map(it=>it.name);
        return ret;
    }
});
Template.bzCreateInvitationCodeModal.onRendered(function() {

    Meteor.setTimeout(function() {
        $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
            $('body').css('overflow', 'hidden')
        });

        $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
            $('body').css('overflow', '');
            codeCreateModalClosed();
        });
    }, 1000);

});

var codeCreateModalClosed = function() {
    $('.js-event-name-input').val('');
    $('.js-trainer-name-input').val('');
    $('.js-city-name-input').val('');
    $('.js-create-code-button').show();
    $('.js-create-code-code-holder').hide().text('');
    $('.js-create-code-close-button').hide();

}
Template.bzCreateInvitationCodeModal.rendered = function() {
    Meteor.typeahead.inject();
}
Template.bzCreateInvitationCodeModal.events({
    'click .js-create-code-button': function(e, view) {
        var code;
        code = bz.bus.invitationCodes.createCode({
            trainerName: view.$('.js-trainer-name-input.tt-input').val() || view.$('.js-trainer-name-input').val(), //= $('.js-location-name-input.tt-input').val() || $('.js-location-name-input').val();
            eventName: view.$('.js-event-name-input.tt-input').val() || view.$('.js-event-name-input').val(),
            issuerId: Meteor.userId(),
            cityName: view.$('.js-city-name-input.tt-input').val() || view.$('.js-city-name-input').val()
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
bz.bus.invitationCodes.getCodeAlias = function(data){
    var code = data && data._id;
    if (code) {
        code = code.toLowerCase().substr(0, 4);
    } else {
        code = null;

    }
    return code;
}

bz.bus.invitationCodes.findCodeByAlias = function(code){
    var code = bz.cols.invitationCodes.findOne({ _id: code }); // todo
    return code;
}
bz.bus.invitationCodes.createCode = function(data){
    var ret;
    ret = bz.cols.invitationCodes.insert(data);
    return ret;
}