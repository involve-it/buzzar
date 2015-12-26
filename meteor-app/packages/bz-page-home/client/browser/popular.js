/**
 * Created by root on 9/15/15.
 */
Template.bzHomePopular.helpers({
  getPopularItems: function() {
    /*var searchSelector = '';
    var ret = bz.cols.posts.find({'status.visible': bz.const.posts.status.visibility.VISIBLE}, {limit:30});
    return ret;*/
    var ret, loc = Session.get('bz.control.search.location'),
      activeCats = Session.get('bz.control.category-list.activeCategories') || [];

    // add all-posts reactivity:
    bz.cols.posts.find({});
    if (loc && loc.coords) {
      ret = bz.bus.search.doSearchClient({
        loc: loc,
        activeCats: activeCats,
        //radius: bz.const.search.AROUND_YOU_RADIUS,
        query: {'status.visible': bz.const.posts.status.visibility.VISIBLE}
      }, {
        limit: bz.const.search.POPULAR_LIMIT,
        sort: {'stats.seenAll': -1}
      });
    }
    if(ret) {
      ret.sort(function (a, b) {
        return a._getDistanceToCurrentLocation(true) - b._getDistanceToCurrentLocation(true);
      });
    }
    return ret;
  }
});


Template.bzHomePopularItem.onCreated(function(){
  Meteor.subscribe('bz.users.all');
});

Template.bzHomePopularItem.rendered = function() {

  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });

  var lineH = $('.bz-content .post-item-text').css('line-height');
  if (Number.parseInt(lineH) !== 'NaN'){
    lineH = Number.parseInt(lineH);
  } else {
    lineH = 20;
  }
  $('.bz-content .post-item-text').css('max-height', lineH * 2);
};

Template.bzHomePopularItem.helpers({
  getPostOwner: function(){
    return Meteor.users.findOne(this.userId);
  },
  categoryType: function() {
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  },
  getRank: function() {},
  getTimeStamp: function(){
    return Date.now();
  },
  getImgSrc: function(){
    var ret, phId = this.details.photos && this.details.photos[0];
    if(phId){
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret.data;
    }
    return ret;
  },
  disableOwnPost: function(){
    if(Meteor.userId() === this.userId ) {
      return 'disabled';
    }
    return '';
  }
});

Template.bzHomePopularItem.events({
  'click .js-send-message-btn': function (e, v) {
    if(!Meteor.userId()){
      Router.go('/sign-in');
    }
    if (Meteor.userId() !== this.userId && this.userId) {
      var chatId = bz.buz.chats.createChatIfFirstMessage(Meteor.userId(), this.userId);
      Router.go('/chat/' + chatId);
    }
  }
})