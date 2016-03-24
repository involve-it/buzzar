/**
 * Created by root on 9/15/15.
 */

Template.bzAroundYou.onRendered(function () {
  Meteor.startup(function () {});
});
      

Template.bzAroundYou.helpers({
  getAroundItems: function () {
    var ret;
    ret = getSearchResultsFromSessionParameters({
      loc: Session.get('bz.control.search.location'),
      dist: Session.get('bz.control.search.distance'),
      cats: Session.get('bz.control.category-list.activeCategories'),
      text: Session.get('bz.control.search.searchedText')
    });
        
    Session.set('bz.control.search.amount', ret && ret.length);

    //console.info(ret);
    
    return ret;
    
    /*var ret, loc = Session.get('bz.control.search.location'),
     distSession = Session.get('bz.control.search.distance') || [],
     activeCats = Session.get('bz.control.category-list.activeCategories') || [];
     if(['home', 'jobs', 'training'].indexOf(Router.getCurrentRouteName()) > -1) {

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
     }).value();
     }
     console.log('Around you posts amount: ' + ret.length);

     }
     reorderGrid();
     return ret;*/
  }
});


Template.bzAroundYouItem.rendered = function () {

  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};


Template.bzAroundYouItem.helpers({
  getPostOwner: function () {
    return Meteor.users.findOne(this.userId);
  },
  getRank: function () {},
  getProgressBar: function () {
    debugger;
  },
  getTimeStamp: function () {
    return Date.now();
  },
  getImgSrc: function () {
    var ret, phId = this.details.photos && this.details.photos[0];
    if (phId) {
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret._getThumbnailUrl();
    }

    ret = ret || '/img/content/no-photo.png';
    return ret;
  },
  disableOwnPost: function () {
    if (Meteor.userId() === this.userId) {
      return 'disabled';
    }
    return '';
  }
});


Template.bzAroundYouItem.onRendered(function() {
  var template = this, lineH, text;
  
  text = template.$('.post-item-text');
  lineH = text.height();
  
  if (Number.parseInt(lineH) !== 'NaN') {
    lineH = Number.parseInt(lineH);
    (lineH > 20) ? text.addClass('bz-text-ellipsis') : '';
  }  
});


Template.bzAroundYouItem.events({
  'click .js-send-message-btn': function (e, v) {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    }
    if (Meteor.userId() !== this.userId && this.userId) {
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this.userId);
      Router.go('/chat/' + chatId);
    }
  }
});


Template.bzUserProfileAroundYou.helpers({
  getNameFormatted: function () {
  }
});


// HELPERS:
function getLatLngBox(lat, lng, radius) {
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
}


function getSearchResultsFromSessionParameters(options = {}){
  var ret, loc = options.loc,
    distSession = options.dist || [],
    activeCats = options.cats || [],
    searchedText = options.text;
  /*
  var ret, loc = options.loc || Session.get('bz.control.search.location'),
    distSession = options.dist || Session.get('bz.control.search.distance') || [],
    activeCats = options.cats || Session.get('bz.control.category-list.activeCategories') || [];*/
  
    if (['home', 'jobs', 'trainings', 'connect', 'trade', 'housing', 'events', 'services', 'help'].indexOf(Router.getCurrentRouteName()) > -1) {

      // add all-posts reactivity:
      bz.cols.posts.find({});
      if (loc && loc.coords) {
        ret = bz.bus.search.doSearchClient({
          loc: loc,
          activeCats: activeCats,
          radius: distSession,
          text: searchedText,
          $where: function() {
            //to show only visible
            return this.status.visible !== null
          }
          //radius: bz.const.search.AROUND_YOU_RADIUS
        }, {
          limit: bz.const.search.AROUND_YOU_LIMIT
        }).fetch();
                
        ret = _(ret).chain().sortBy(function (item) {
          return item.stats && item.stats.seenTotal || 0;
        }).reverse().sortBy(function (doc) {
          return doc._getDistanceToCurrentLocationNumber();
        }).value();
      }
      //console.log('Around you posts amount: ' + ret.length);
  }
  return ret;
}