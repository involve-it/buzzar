/**
 * Created by Ashot on 9/19/15.
 */
bz.help.makeNamespace('bz.runtime.newPost.location');

createNewPostFromView = function (v) {
  var userId = Meteor.userId(), imgId, imgArr = [], locationsArr = [],
    locDef = $.Deferred(),
    loc1 = Session.get(bz.const.posts.location1),
    loc2 = Session.get(bz.const.posts.location2),

    rad = $('.js-radius-slider').attr('data-slider') && Number.parseInt($('.js-radius-slider').attr('data-slider')),
    otherKeyValuePairs = [], timestamp, endTimestamp;

  // gather all data and submit for post-create:
  if (userId) {
    if (Session.get('bz.posts.postImgArr')) {
      //if (bz.runtime.newPost.postImage) {
      _.each(Session.get('bz.posts.postImgArr'), function (img) {
        img = img || {};
        imgId = bz.cols.images.insert({
          data: img.data,
          userId: userId
        });
        imgArr.push(imgId);
      });
    }
    // set location:
    //if (bz.runtime.newPost.location && bz.runtime.newPost.location.current) {
    if (loc1 && location1.isSet) {
      // bz.help.maps.getCurrentLocation(function (loc) {
      locationsArr.push(loc1);
      //locDef.resolve();
      //});
    }
    if (loc2 && location2.isSet) {
      locationsArr.push(loc2);
      //locDef.resolve();
    }
    // set the 'other' field, that contains: all other post-specific key-value pairs of info that we want:
    if (v.$('.js-charity-type-select').val()) {
      otherKeyValuePairs.push({
        key: 'whatHappened',
        value: v.$('.js-charity-type-select').val()
      });
    }
    // created timestamp:
    timestamp = Date.now();
    endTimestamp = new Date(timestamp);
    var newPost = {

      userId: userId,
      type: determinePostTypeFromView(v),
      //type: v.$('.js-post-type-select').val(),
      details: {

        hashes: bz.runtime.newPost.hashes,
        //location: bz.runtime.newPost.location,
        locations: locationsArr,
        radius: rad,
        url: v.$('.js-original-url').val(),

        //details:
        title: v.$('.js-post-title').val(),
        description: v.$('.js-post-description').val(),
        price: v.$('.js-post-price').val(),
        photos: imgArr,

        // specific:
        other: otherKeyValuePairs
      },
      status: {
        visible: bz.const.posts.status.visibility.VISIBLE
      },
      timestamp: timestamp,
      endDatePost: getEndDatePost(v, endTimestamp)
      
    };

    var currentLoc = Session.get('currentLocation');
    if (currentLoc){
      currentLoc = {
        lat: currentLoc.latitude,
        lng: currentLoc.longitude
      };
    } else {
      currentLoc = Session.get('bz.control.search.location');
      if (currentLoc){
        currentLoc = currentLoc.coords;
      }
    }

    //$.when(locDef).then(function () {
    Meteor.call('addNewPost', newPost, currentLoc, Meteor.connection._lastSessionId, function (err, res) {
      if (!err && res && res !== '') {
        clearPostData();
        bz.runtime.newPost.postId = res;
        Router.go('/posts/my');
      }
    });
  }
};
movingLocationPanelClick = function() {
  var chosenLocation = Session.get(location1.sessionName);
  if (!chosenLocation) {
    // nothing is set as a location, need to set it, for this show user location-choose control:
    //$('.js-location-holder a').click();
    bz.help.maps.getCurrentLocation(function (loc) {
      /*var chosenLocation = Session.get('bz.posts.new.location1');
       var name = 'current';
       var existLoc = bz.cols.locations.findOne({name: name, userId: Meteor.userId()});
       if (existLoc) {
       bz.cols.locations.remove(existLoc._id);
       }
       bz.cols.locations.insert({
       userId: Meteor.userId(),
       name: 'current',
       coords: loc
       });*/

      Meteor.call('setUserCurrentLocation', Meteor.userId(), loc, function (err, resLocation) {
        location1.setLocation(resLocation);
      });
      /*locationsArr.push({
       coords: loc,
       type: bz.const.locations.type.STATIC
       });
       locDef.resolve();*/
    });
    //Template.bzLocationNameNewPost.showModal();
  }
};
staticLocationPanelClick = function() {
  var chosenLocation = Session.get(location2.sessionName);
  if (!chosenLocation) {
    // nothing is set as a location, need to set it, for this show user location-choose control:
    //$('.js-location-holder a').click();
    Template.bzLocationNameNewPost.showModal();
  }
};
//userSeenAll;
// this function calculates browser-specific hits
runHitTracking = function (post, browserInfo) {
  var userSeenTotal, userSeenToday, seenTotalPost, seenTodayPost;
  userSeenTotal = Cookie.get('bz.posts.seenTotal.postId.' + post._id)
  if (!userSeenTotal) {
    seenTotalPost = post.stats && post.stats.seenTotal || 0;
    bz.cols.posts.update(post._id, {$set: {'stats.seenTotal': ++seenTotalPost }});
    //setCookie('bz.posts.seenTotal.postId.' + post._id, true);
    Cookie.set('bz.posts.seenTotal.postId.' + post._id, true);
    userSeenTotal = undefined;
  } else {
    // user seen this already, do nothing!
  }
  // set total unique today:
  userSeenToday = Cookie.get('bz.posts.seenToday.postId.' + post._id);
  if (!userSeenToday) {
    seenTodayPost = post.stats && post.stats.seenToday || 0;
    bz.cols.posts.update(post._id, {$set: {'stats.seenToday': ++seenTodayPost }});
    Cookie.set('bz.posts.seenToday.postId.' + post._id, true, { days: 1 });
    userSeenToday = undefined;
  } else {
    // user seen this already, do nothing!
  }
  // set total loads (non-unique):
  if(!userSeenAll) { // need to run only on-time on full load
    userSeenAll = !userSeenAll && post.stats && post.stats.seenAll || 0;
    bz.cols.posts.update(post._id, {$set: {'stats.seenAll': ++userSeenAll}});
  }
};
clearPostData = function() {
  resetImagesArraySession();
}
// location1 variable:
location1 = {
  isSet: false,
  sessionName: 'bz.posts.new.location1',
  dbObject: undefined,
  setLocation: function (dbObject) {
    this.isSet = true;
    this.dbObject = dbObject;
    Session.set(this.sessionName, dbObject);
  }
};
location2 = {
  isSet: false,
  sessionName: 'bz.posts.new.location2',
  dbObject: undefined,
  setLocation: function (dbObject) {
    this.isSet = true;
    this.dbObject = dbObject;
    Session.set(this.sessionName, dbObject);
  }
};

getPostPhotoObjectsByIds = function(photoIds){
  var photos = photoIds, ret = [];
  _.each(photos, function(id){
    ret.push(bz.cols.images.findOne(id));
  });
  return ret;
};
resetImagesArraySession = function(){
  Session.set('bz.posts.postImgArr', []);
}
GetPostAdTypesI18n = function(lang) {
  var  ret;
  if(lang){
    ret = bz.cols.postAdTypes.find({},  {transform: function (doc) {
      var doc1 = _.extend(doc, doc.i18n[lang]);
      return doc1;
    }});
  } else {
    ret = bz.cols.postAdTypes.find({});
  }
  return ret;

};
//PostIsLikedByCurrentUser = (curPost)=>{
PostIsLikedByCurrentUser = function(curPost) {
  var ret,
    userId = Meteor.userId(),
    postObj = curPost || bz.bus.posts.getCurrentPost(),
    foundPost = bz.cols.posts.findOne({
      _id: 'fBNoBZaWZD2eoTyQ6',
      'social.likes': {$elemMatch: {userId: userId}}
    });
  ret = !!foundPost;
  return ret;
}
PostBelongsToUser = function (postOwnerId) {
  var ret = false,
    userId = Meteor.userId();
  ret = postOwnerId === userId;
  return ret;
}
LikePostByUser = function (postOwnerId) {
  var ret = false,
    curPost = bz.bus.posts.getCurrentPost(),
    userId = userId || Meteor.userId();
  if (curPost && userId && !PostBelongsToUser(postOwnerId)) {
    if (!PostIsLikedByCurrentUser()) {
      bz.cols.posts.update(curPost._id, { $push: { 'social.likes': { userId: userId, ts: Date.now() }}});
    } else {
      bz.cols.posts.update(curPost._id, { $pop:  { 'social.likes': { userId: userId, ts: Date.now() }}});
    }
  }
  return ret;
}
// API:
bz.help.makeNamespace('bz.bus.posts', {
  getCurrentPost: function() {
    var ret, postId = Router.current() && Router.current().params._id;
    if (postId) {
      ret = bz.cols.posts.findOne(postId);
    }
    return ret;
  }
});

//HELPERS:
function determinePostTypeFromView (v){
  //newPostType
  //v.$('.js-post-type-select').val()
  var ret;
  if(newPostType.get() === bz.const.posts.type.ad) {
    ret = v.$('.js-ad-type-select').val();
  } else if (newPostType.get() === bz.const.posts.type.memo) {
    ret = v.$('.js-memo-type-select').val();
  }
  return ret;
}
function getEndDatePost(v, start) {
  var val = v.$('#selectEndDatePost').val(),
      ret;

  switch (val) {
    case 'oneDay':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, start.getHours(), start.getMinutes()); break;
    case 'twoDay':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 2, start.getHours(), start.getMinutes()); break;
    case 'week':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7, start.getHours(), start.getMinutes()); break;
    case 'twoWeek':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 14, start.getHours(), start.getMinutes()); break;
    case 'month':
      ret = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()); break;
    case 'year':
      ret = new Date(start.getFullYear() +1, start.getMonth(), start.getDate(), start.getHours(), start.getMinutes()); break;
    default:
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 14, start.getHours(), start.getMinutes()); break;
  }
  return ret && ret.getTime();
}

