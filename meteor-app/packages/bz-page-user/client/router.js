/**
 * Created by Ashot on 9/18/15.
 */
Router.map(function () {
  this.route('settings', {
    template: 'userSettings',
    controller: 'requireLoginController',
    waitOn: function () {
      return [
        Meteor.subscribe('users')
      ]
    },
    data: function () {
      return Meteor.user();
    }
  });

  this.route('userProfile', {
    path: '/user/:_id',
    template: 'userSettings',
    //controller: 'requireLoginController',
    waitOn: function () {
      return []
    },
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });

  this.route('settings.edit', {
    path: '/settings/edit',
    template: 'settingsEdit',
    controller: 'requireLoginController',
    waitOn: function () {
      return []
    },
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });
});