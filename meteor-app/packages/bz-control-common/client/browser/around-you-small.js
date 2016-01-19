/**
 * Created by root on 9/15/15.
 */
function getLatLngBox (lat, lng, radius){
  if (lat && lng && radius) {
    var dLat = (radius / bz.const.locations.earthRadius) / Math.PI * 180,
        dLng = (radius / bz.const.locations.earthRadius / Math.cos(lat * Math.PI / 180)) / Math.PI * 180;
    return {
      lng1: lng - dLng,
      lng2: lng + dLng,
      lat1: lat - dLat,
      lat2: lat + dLat
    };
  } else {
    return null;
  }
};

Template.aroundYouSmall.helpers({
  getAroundItems: function() {
    var ret, loc = Session.get('bz.control.search.location'),
      activeCats = Session.get('bz.control.category-list.activeCategories') || [];

    // add all-posts reactivity:
    bz.cols.posts.find({});
    if (loc && loc.coords) {
      ret = bz.bus.search.doSearchClient({
        loc: loc,
        activeCats: activeCats,
        radius: bz.const.search.AROUND_YOU_RADIUS
      }, {
        limit: 4,
        //limit: bz.const.search.AROUND_YOU_LIMIT,
        sort: {'stats.seenAll': -1}
      });
    }
    return ret;
  }
});

Template.bzAroundYouSmallItem.onCreated(function(){
  Meteor.subscribe('bz.users.all');
});

Template.bzAroundYouSmallItem.rendered = function() {

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

Template.bzAroundYouSmallItem.helpers({
  getPostOwner: function(){
    return Meteor.users.findOne(this.userId);
  },
  getRank: function() {},
  getProgressBar: function() {
    debugger;
  },
  getTimeStamp: function(){
    return Date.now();
  },
  getImgSrc: function(){
    var ret, phId = this.details.photos && this.details.photos[0];
    if(phId){
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret.data;
    }
    ret = ret || '/img/content/no-photo-400x300.png';
    return ret;
  },
  disableOwnPost: function(){
    if(Meteor.userId() === this.userId ) {
      return 'disabled';
    }
    return '';
  }
});
Template.bzAroundYouSmallItem.events({
  'click .js-send-message-btn': function (e, v) {
    if(!Meteor.userId()){
      Router.go('/sign-in');
    }
    if (Meteor.userId() !== this.userId && this.userId) {
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this.userId);
      Router.go('/chat/' + chatId);
    }
  }
});