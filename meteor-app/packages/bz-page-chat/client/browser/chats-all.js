/**
 * Created by douson on 24.08.15.
 */

Template.bzChatsMy.onCreated(function () {
  //return Meteor.subscribe('posts-images');
});

Template.bzChatsMy.helpers({
  posts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    return posts;
  }
});

Template.onePostRowItem.helpers({
  getPhotoUrl: function () {
    var photo = bz.cols.posts.findOne({_id: this._id}),
      photoId = photo.details.photos && photo.details.photos[0] || undefined;

    if (photoId) {
      var image = bz.cols.images.findOne({_id: photoId});
    }

    return image;

  },
  getPrice: function () {
  }
});
// reply area
Template.replyArea.events({
  'click ': function(e, tmpl) {
    e.preventDefault();

    var textArea = tmpl.$('...');
    var val = textArea.val();

    textArea.attr('disable', 'disable');

    /* ... */
  },
  'keypress textarea': function(e, tmpl) {
    if(e.keyCode === 13) {
      e.preventDefault();
      tmpl.$('...').submit();
    }
  }
});


Template.chatMessage.helpers({
  getMessageClass: function () {
    var className = '';
    if (this.userId === currentUser._id) {
      // my message
      className = 'my-message';
    } else {
      className = 'friends-message';
    }
    return className;
  },
  isOwnMessage: function () {
  }
});


