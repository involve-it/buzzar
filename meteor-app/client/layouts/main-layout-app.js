/**
 * Created by douson on 06.07.15.
 */



Template.ionBody.rendered = function () {

    /*side menu settings*/
    
        IonSideMenu.snapper.settings({
            /*disable: 'right',*/
            touchToDrag: false,
            /*dragger: document.getElementById('element here'),*/
            hyperextensible: false
        });

};
Template.mainLayoutApp.events({
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
    },
    'click [data-action=edit-avatar]': function (event, template) {
        IonActionSheet.show({
            titleText: 'Edit picture',
            buttons: [
                { text: 'Photo Library' },
                { text: 'Take Photo' }
            ],
            cancelText: 'Cancel'
            }
        )}
});