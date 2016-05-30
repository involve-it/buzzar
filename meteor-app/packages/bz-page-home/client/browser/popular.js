/**
 * Created by root on 9/15/15.
 */
Template.bzHomePopular.helpers({
  getPopularItems: function () {
    
    /* OLD CODE */
    /*var ret;
    bz.cols.posts.find({});
    ret = bz.bus.search.searchePostsAroundAndPopular().popular;
    return ret;*/
    
    
    
  }
});


Template.bzHomePopularItem.onCreated(function () {
  //Meteor.subscribe('bz.users.all');
});

Template.bzHomePopularItem.rendered = function () {
  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};

Template.bzHomePopularItem.helpers({
  getPostOwner: function () {
    return Meteor.users.findOne(this.userId);
  },
  getRank: function () {
  },
  getTimeStamp: function () {
    return Date.now();
  },
  getImgSrc: function () {
    var ret, phId = this.details.photos && this.details.photos[0];
    if (phId) {
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret.data;
    }
    return ret;
  },
  disableOwnPost: function () {
    if (Meteor.userId() === this.userId) {
      return 'disabled';
    }
    return '';
  }
});


Template.bzHomePopularItem.onRendered(function() {
  var template = this, textH, text;

  text = template.$('.post-item-text');
  textH = text.css('line-height');

  if (Number.parseInt(textH) !== 'NaN') {
    textH = Number.parseInt(textH);
  } else {
    textH = 19;
  }
  text.addClass('bz-text-ellipsis').css('max-height', textH * 2);
});


Template.bzHomePopularItem.events({
  'click .js-send-message-btn': function (e, v) {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    }
    if (Meteor.userId() !== this.userId && this.userId) {
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this.userId);
      Router.go('/chat/' + chatId);
    }
  }
})