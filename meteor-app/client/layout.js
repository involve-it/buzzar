/**
 * Created by douson on 06.07.15.
 */



Template.layout.rendered = function () {
    /*
    if(Meteor.userId()) {
        IonSideMenu.snapper.settings({
            disable: 'right',
            speed: 1,
            easing: 'ease'
        });
    }
    */
};

Template.home.helpers({

});

Template.layout.events({
    'click [data-action=share-profile]': function (event, template) {
        IonActionSheet.show({
            titleText: 'Share Profile',
            buttons: [
                { text: 'One' },
                { text: 'Two' },
                { text: 'Some text' }
            ],
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                if (index === 0) {
                    console.log('ONE!');
                }
                if (index === 1) {
                    console.log('TWO!');
                }
                if (index === 2) {
                    console.log('SOME TEXT');
                }
                return true;
            }
        });
    }
});