/**
 * Created by root on 9/15/15.
 */
Template.bzHomePopular.helpers({
  getPopularItems: function () {
    /*var searchSelector = '';
     var ret = bz.cols.posts.find({'status.visible': bz.const.posts.status.visibility.VISIBLE}, {limit:30});
     return ret;*/
    var ret, loc = Session.get('bz.control.search.location'),
      activeCats = Session.get('bz.control.category-list.activeCategories') || [];

    // add all-posts reactivity:
    bz.cols.posts.find({});
    ret = bz.bus.search.doSearchClient({
      loc: loc,
      activeCats: activeCats,
      $where: function() {
        //to show only visible
        return this.status.visible !== null
      },
      //radius: bz.const.search.AROUND_YOU_RADIUS,
      /*query: {
        'status.visible': {$exists: true}
      }*/
    }, {
      limit: bz.const.search.POPULAR_LIMIT
    }).fetch();
    ret = _(ret).chain().sortBy(function(item){
      return item.stats && item.stats.seenTotal  || 0;
    }).reverse().sortBy(function(doc) {
      return doc._getDistanceToCurrentLocationNumber();
    }).value();
    console.log('Popular posts amount: ' + ret.length);
    return ret;
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

  var lineH = $('.bz-content .post-item-text').css('line-height');
  if (Number.parseInt(lineH) !== 'NaN') {
    lineH = Number.parseInt(lineH);
  } else {
    lineH = 20;
  }
  $('.bz-content .post-item-text').css('max-height', lineH * 2);
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