/**
 * Created by douson on 09.07.15.
 */

Template.userSettings.onCreated(function() {
    
    
});

Template.userSettings.helpers({
    username: function() {
        // username of logged in user
        var user = Meteor.users.findOne({_id: Meteor.userId()} );
        return user && user.username;
    },
    getIdProfile: function () {
        //console.log('ID профайла пользователя ' + this._id);
        return this._id;
    },
    getIdGuestUser: function() {
        //console.log('ID гостя ( залогиненного ) ' + Meteor.userId());
        return Meteor.userId();
    }
});




Template.userSettings.events({
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
                    /*CONSOLE CLEAR
                    console.log('ONE!');
                    */
                }
                if (index === 1) {
                    /*CONSOLE CLEAR
                    console.log('TWO!');
                    */
                }
                if (index === 2) {
                    /*CONSOLE CLEAR
                    console.log('SOME TEXT');
                    */
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
        )
    }
});