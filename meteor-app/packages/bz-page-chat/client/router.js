/**
 * Created by douson on 03.07.15.
 */
Router.map(function () {
  this.route('chats', {
    path: '/chats',
    controller: 'requireLoginController',
    onBeforeAction: function () {
      Router.go('/chats/my');
    }
  });
  this.route('chats.id', {
    path: '/chats/:userId',
    template: 'bzChatId',
    controller: 'requireLoginController',

    waitOn: function(){
      var usersArr = [],
        currentUser = Meteor.user(),
        friendUserId = this.params.userId;
      currentUser && usersArr.push(currentUser._id);
      friendUserId && usersArr.push(friendUserId);
      return [
        //Meteor.subscribe('bz.users.byId', this.params.userId)
        Meteor.subscribe('bz.users.all'),
        Meteor.subscribe('bz.messages.users', usersArr)
      ]
    },
    data: function () {
      var usersArr = [],
        currentUser = Meteor.user(),
        friendUserId = this.params.userId;
      currentUser && usersArr.push(currentUser._id);
      friendUserId && usersArr.push(friendUserId);
      var ret = {
        user : Meteor.users.findOne({ _id: this.params.userId }),
        messages: bz.cols.messages.find({userId: {$in: usersArr}, toUserId: {$in: usersArr}})
      }
      return ret;
    },

    onBeforeAction: function () {
      if (!this.data() || !this.data().user || !this.data().messages) {
        Router.go('/page-not-found');
      } else {
        this.next();
      }
    }
  });

  this.route('chats.my', {
    path: '/chats/my',
    template: 'bzPageChats',
    layoutTemplate: 'mainLayout',
    controller: 'requireLoginController'
  });

  // create post flow:
  this.route('chats.new', {
    path: '/chats/new',
    controller: 'requireLoginController'
  });
});