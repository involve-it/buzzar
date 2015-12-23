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

Template.aroundYou.helpers({
  aroundItem: function() {
    var loc = Session.get('bz.control.search.location');
    if (loc && loc.coords){
      var box = getLatLngBox(loc.coords.lat, loc.coords.lng, 5);
      if (box){
        var ret = bz.cols.posts.find({
          'details.locations':{
            $elemMatch: {
              'coords.lat': {$gte: box.lat1, $lte: box.lat2},
              'coords.lng': {$gte: box.lng1, $lte: box.lng2}
            }
          }
        }, {limit:3}).fetch();
      }
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
Template.bzAroundYouItem.events({
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
Template.bzUserProfileAroundYou.helpers({
  getNameFormatted: function () {}
});