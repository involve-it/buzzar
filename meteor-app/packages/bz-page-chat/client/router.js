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
    path: '/chat/:chatId',
    template: 'bzChatId',
    controller: 'requireLoginController',

    waitOn: function () {
      var chatId = this.params.chatId;
      return [
        //Meteor.subscribe('bz.users.byId', this.params.userId)
        Meteor.subscribe('bz.users.all'),
        Meteor.subscribe('bz.chats.id', chatId),
        Meteor.subscribe('bz.messages.chatId', chatId)
      ]
    },
    data: function () {
      var chatId = this.params.chatId,
        chat = bz.cols.chats.findOne(chatId),
        user = chat && chat.users && chat.users[0];
      if (user) {
        var ret = {
          chatId: chatId,
          user: Meteor.users.findOne(user),
          messages: bz.cols.messages.find({chatId: chatId})
        }
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
    controller: 'requireLoginController',
    waitOn: function () {
      return [
        Meteor.subscribe('bz.chats.my', Meteor.userId())
      ]
    },
    data: function () {
      return bz.cols.chats.find({
        userId: Meteor.userId()
      });
    }
  });

  // create post flow:
  this.route('chats.new', {
    path: '/chats/new',
    controller: 'requireLoginController'
  });
});
/*

 this.route('chats.id', {
 path: '/chat/:userId',
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
 debugger;
 Router.go('/page-not-found');
 } else {
 this.next();
 }
 }
 });*/
