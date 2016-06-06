/**
 * Created by root on 9/15/15.
 */

Template.bzAroundYou.onCreated(function() {
  this.getSearchData = new ReactiveVar(false);
  //this.getNearByData = new ReactiveVar(false);
});

Template.bzAroundYou.onRendered(function () {
  Meteor.startup(function () {});
});

Template.bzAroundYou.helpers({
  getData: function() {
    return Template.instance().getSearchData.get();
  },
  getAroundItems: function () {
    var ret,
        ins = Template.instance(),
        inputSearchText = Session.get('bz.control.search.searchedText'),
        currentLocation = Session.get('currentLocation'),
        radius = Session.get('bz.control.search.distance'),
        activeCats = Session.get('bz.control.category-list.activeCategories'),
        searchAmount;
    
    //var throttle = _.throttle(function(){console.log('called')}, 10000);
    
    ret = (inputSearchText) ? searchPosts(inputSearchText, currentLocation, radius, activeCats) : nearbyPosts(currentLocation, radius, activeCats) ;
    
    function searchPosts(text, loc, radius, activeCats) {
      var request = {};
        

      //console.info('DATA: ', ins.getSearchData.get());
      
      request = {
        query: text,
        lat: loc.latitude,
        lng: loc.longitude,
        radius: radius,
        activeCats: activeCats
      };

      //if (ins.getSearchData.get() === false) {
        Meteor.call('searchPosts', request, function(e, r) {
          var res;
          //console.info('Зашли в метод');          
          res = (!e) ? r : e;

          if (res.error) {
            bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
            return;
          }

          if(res.success && res.result) {
            searchAmount = res.result.length;
            (res.result.length > 0) ? ins.getSearchData.set(res.result) : ins.getSearchData.set([]);
            //console.info('Вернувшийся результат: ', res.result);
            //console.info('Данные из метода: ', ins.getSearchData.get());
            Session.set('bz.control.search.amount', searchAmount);
          } else {
            bz.ui.alert('Error ID: ' + res.error.errorId, {type:'error', timeout: 2000});
          }
          
          
        });
      //}

      console.log('searchPosts');
      return ins.getSearchData;
    }
    
    
    function nearbyPosts(loc, radius, activeCats) {
      var request = {};

      request = {
        lat: loc.latitude,
        lng: loc.longitude,
        radius: radius,
        activeCats: activeCats
      };

      /*if (ins.getNearByData.get() === false) {*/
        Meteor.call('getNearbyPostsTest', request, function (e, r) {
          var res;
  
          res = (!e) ? r : e;
  
          if (res.error) {
            bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
            return;
          }
  
          if (res.success && res.result) {
            
            //ins.getNearByData.set(res.result);
            (res.result.length > 0) ? ins.getSearchData.set(res.result) : ins.getSearchData.set([]);
            //console.info('Данные из метода nearbyPosts: ', ins.getNearByData.get());
  
          } else {
            bz.ui.alert('Error ID: ' + res.error.errorId, {type: 'error', timeout: 2000});
          }
  
        });
    /*}*/
      console.log('nearbyPosts');
      //return console.log('nearbyPosts');
      return ins.getSearchData;
    }
    
    //return ret;
    
    
    /*ret = getSearchResultsFromSessionParameters({
      loc: Session.get('bz.control.search.location'),
      dist: Session.get('bz.control.search.distance'),
      cats: Session.get('bz.control.category-list.activeCategories'),
      text: Session.get('bz.control.search.searchedText')
    });
        
    Session.set('bz.control.search.amount', ret && ret.length);
    
    return ret;*/
    
    /* OLD CODE */
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

Template.bzAroundYou.events({
  'click .js-show-more-posts-btn': function (e, v){
    bz.bus.search.showMorePosts();
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
  var ret;
  bz.cols.posts.find({});
  ret = bz.bus.search.searchePostsAroundAndPopular().aroundYou;
  if (ret.length<Session.get('bz.control.search.postCountLimit')){
    $('div.show-more-button a.js-show-more-posts-btn').addClass('disabled');
  }
  else{
    $('div.show-more-button a.js-show-more-posts-btn').removeClass('disabled');
  }
  ret = _(ret).chain().sortBy(function(doc) {
    return doc._getDistanceToCurrentLocationNumber();
  }).value();
  return ret;
}