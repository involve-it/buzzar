/**
 * Created by root on 9/15/15.
 */
Template.bzHomePopular.onCreated(function() {
  this.getPopularData = new ReactiveVar(false);
});

Template.bzHomePopular.helpers({
  getData: function() {
    return Template.instance().getPopularData.get();
  },
  getPopularItems: function () {
    
    /* OLD CODE */
    /*var ret;
    bz.cols.posts.find({});
    ret = bz.bus.search.searchePostsAroundAndPopular().popular;
    return ret;*/

    var ret,
        ins = Template.instance(),
        currentLocation = Session.get('currentLocation'),
        radius = Session.get('bz.control.search.distance'),
        activeCats = Session.get('bz.control.category-list.activeCategories');
        
    // if(currentLocation) {
      popularPosts(currentLocation, radius, activeCats);
    // }
    
    function popularPosts(currentLocation = {}, radius, activeCats) {
      var request = {};
      
      request = {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
        radius: radius,
        activeCats: activeCats
      };
      Meteor.call('getPopularPosts', request, function(e, r) {
        var res;
        res = (!e) ? r : e;

        if (res.error) {
          bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
          return;
        }

        if (res.success && res.result) {
          _.each(res.result, p => {
            Object.assign(p, bz.cols.posts.bzHelpers);
          });

          // extend with helpers, since we're not using collection anymore:
          var photoHelpers = bz.help.images;
          r.result.length && r.result.forEach(data => data.details && data.details.photos && data.details.photos.forEach(p => Object.assign(p, photoHelpers)));

          (res.result.length > 0) ? ins.getPopularData.set(res.result) : ins.getPopularData.set([]);
          //console.info('Данные из метода getPopularPosts: ', res.result);
        } else {
          bz.ui.alert('Error ID: ' + res.error.errorId, {type:'error', timeout: 2000});
        }
      });
    }
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
    var ret, ret = this.details.photos && this.details.photos[0];
    if (ret) {
      // ret = bz.cols.images.findOne(phId);
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
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this.userId).then(function(chatId) {
          Router.go('/chat/' + chatId);
      });
    }
  }
})