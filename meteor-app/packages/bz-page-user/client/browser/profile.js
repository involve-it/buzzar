/**
 * Created by douson on 09.07.15.
 */

Template.profileSettings.onCreated(function() {
    
    
});



Template.profileSettings.helpers({
  setLanguage: function() {
    
    var curLang = Meteor.users.findOne({_id: Meteor.userId()});
    
    return [
      {code: 'en', name: 'English'},
      {code: 'ru', name: 'Русский'}  
    ]
    
  },
    username: function () {
        // username of logged in user
        var user = Meteor.users.findOne({_id: Meteor.userId()});
        return user && user.username;
    },
    getIdProfile: function () {
        //console.log('ID профайла пользователя ' + this._id);
        return Meteor.absoluteUrl() + 'user/' + this._id;
    },
    getIdGuestUser: function () {
        //console.log('ID гостя ( залогиненного ) ' + Meteor.userId());
        return Meteor.userId();
    },
    getFaceBookDetails: function () {
    },
    getStatusLocation: function () {

    }
});




Template.profileSettings.events({
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
        /*IonActionSheet.show({
              titleText: 'Edit picture',
              buttons: [
                  { text: 'Photo Library' },
                  { text: 'Take Photo' }
              ],
              cancelText: 'Cancel'
          }
        )*/
    }
});