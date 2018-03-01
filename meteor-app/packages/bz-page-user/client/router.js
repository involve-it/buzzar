/**
 * Created by Ashot on 9/18/15.
 */
Router.map(function () {
  this.route('myProfile', {
    path: 'profile',
    template: 'profileSettings',
    controller: 'requireLoginController',
    waitOn: function () {
      return [
        //Meteor.subscribe('users')
        /* OLD CODE */
        //Meteor.subscribe('profileDetails-my')
      ]
    },
    data: function () {
      return Meteor.user();
    }
  });
  this.route('settings.edit', {
    path: '/profile/edit',
    template: 'userEdit',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    },
    data: function () {
      return Meteor.user();
    }
  });

  this.route('userProfile', {
    path: '/user/:_id',
    controller: 'baseController',
    template: 'userSettings',
    //controller: 'requireLoginController',
    waitOn: function () {
      //var user = Meteor.users.findOne({_id: Meteor.userId()});
      return [
        /* OLD CODE */
        //Meteor.subscribe('profileDetails-another'),
        Meteor.subscribe('users'),
        Meteor.subscribe('bz.chats.my', Meteor.userId())
      ]
    },
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });


});