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

Template.aroundYou.onRendered(function() {
  
});


if(Meteor.isServer) {
  Meteor.publish('aroundYou', function() {
    
  });
}


Template.aroundYou.helpers({
  getAroundItems: function() {
    var ret, loc = Session.get('bz.control.search.location'),
      distSession = Session.get('bz.control.search.distance') || [],
      activeCats = Session.get('bz.control.category-list.activeCategories') || [];
    if(['home', 'jobs', 'training', 'connect', 'trade', 'housing', 'events', 'services', 'help'].indexOf(Router.getCurrentRouteName()) > -1) {

      // add all-posts reactivity:
      bz.cols.posts.find({});
      if (loc && loc.coords) {
        ret = bz.bus.search.doSearchClient({
          loc: loc,
          activeCats: activeCats,
          radius: distSession
          //radius: bz.const.search.AROUND_YOU_RADIUS
        }, {
          limit: bz.const.search.AROUND_YOU_LIMIT,
        }).fetch();
        ret = _(ret).chain().sortBy(function(item){
          return item.stats && item.stats.seenTotal  || 0;
        }).reverse().sortBy(function(doc) {
          return doc._getDistanceToCurrentLocationNumber();
        }).reverse().value();
      }
      console.log('Around you posts amount: ' + ret.length);

    }
    return ret;
  }
});

Template.bzAroundYouItem.onCreated(function(){
  Meteor.subscribe('bz.users.all');
});

Template.bzAroundYouItem.rendered = function() {

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

Template.bzAroundYouItem.helpers({
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
      ret = ret && ret._getThumbnailUrl();
    }

    ret = ret || '/img/content/no-photo.png';
    return ret;
  },
  disableOwnPost: function(){
    if(Meteor.userId() === this.userId ) {
      return 'disabled';
    }
    return '';
  }
});
Template.bzAroundYouItem.events({
  'click .js-send-message-btn': function (e, v) {
    if(!Meteor.userId()){
      Router.go('/sign-in');
    }
    if (Meteor.userId() !== this.userId && this.userId) {
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this.userId);
      Router.go('/chat/' + chatId);
    }
  }
})
Template.bzUserProfileAroundYou.helpers({
  getNameFormatted: function () {}
});