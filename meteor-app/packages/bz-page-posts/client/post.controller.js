/**
 * Created by Ashot on 9/19/15.
 */
bz.help.makeNamespace('bz.runtime.newPost.location');


movingLocationPanelClick = function () {
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
  }
};
staticLocationPanelClick = function (isSet) {
  var chosenLocation = Session.get(location2.sessionName);
  if (!chosenLocation || isSet) {
    // nothing is set as a location, need to set it, for this show user location-choose control:
    //$('.js-location-holder a').click();
    Template.bzLocationNameNewPost.showModal();
  }
};
userSeenAll;
// this function calculates browser-specific hits
runHitTracking = function (post, browserInfo) {
  var userSeenTotal, userSeenToday, seenTotalPost, seenTodayPost, seenObj;
  userSeenTotal = Cookie.get('bz.posts.seenTotal.postId.' + post._id);
  if (!userSeenTotal) {
    seenTotalPost = post.stats && post.stats.seenTotal || 0;
    ++seenTotalPost;
    seenObj = {'stats.seenTotal': seenTotalPost};
    Meteor.call('seenPostUpdate',post._id,seenObj);
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
    ++seenTodayPost;
    seenObj = {'stats.seenToday': seenTodayPost};
    Meteor.call('seenPostUpdate',post._id,seenObj);
    Cookie.set('bz.posts.seenToday.postId.' + post._id, true, {days: 1});
    userSeenToday = undefined;
  } else {
    // user seen this already, do nothing!
  }
  // set total loads (non-unique), WE DON'T USE THIS!:
  if (!userSeenAll) { // need to run only on-time on full load
    userSeenAll = !userSeenAll && post.stats && post.stats.seenAll || 0;
    ++userSeenAll;
    seenObj = {'stats.seenAll': userSeenAll};
    Meteor.call('seenPostUpdate',post._id,seenObj);
  }
};
clearPostData = function () {
  resetImagesArray();
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

getPostPhotoObjectsByIds = function (photoIds) {
  var photos = photoIds, ret = [];
  _.each(photos, function (id) {
    ret.push(bz.cols.images.findOne(id));
  });
  return ret;
};
resetImagesArray = function () {
  imagesArrayReactive.set([]);
}
GetPostAdTypesI18n = function (lang) {
  var ret;
  if (lang) {
    ret = bz.cols.postAdTypes.find({}, {
      transform: function (doc) {
        var doc1 = _.extend(doc, doc.i18n[lang]);
        return doc1;
      }
    });
  } else {
    ret = bz.cols.postAdTypes.find({});
  }
  return ret;

};
//PostIsLikedByCurrentUser = (curPost)=>{
PostIsLikedByCurrentUser = function (curPost) {
  var ret,
    userId = Meteor.userId(),
    postObj = curPost || bz.bus.posts.getCurrentPost(),
    foundPost;
  if (userId && postObj) {
    foundPost = bz.cols.posts.findOne({
      _id: postObj._id,
      'social.likes': {$elemMatch: {userId: userId}}
    });
  }
  ret = !!foundPost;
  return ret;
}
PostIsRatedByCurrentUser = function (curPost) {
  var ret,
    userId = Meteor.userId(),
    postObj = curPost || bz.bus.posts.getCurrentPost(),
    foundPost = bz.cols.posts.findOne({
      _id: postObj._id,
      'social.rates': {$elemMatch: {userId: userId}}
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
  var ret = false, like = false,
    curPost = bz.bus.posts.getCurrentPost(),
    userId = userId || Meteor.userId();
  if (curPost && userId && !PostBelongsToUser(postOwnerId)) {
    if (!PostIsLikedByCurrentUser()) {
      like =true;
    } else {
      like=false
    }
    Meteor.call('likePostUpdate', curPost._id, userId, like);
  }
  return ret;
}
RatePostByUser = function (postOwnerId, rateInt) {
  var ret = false, rateObj,
    curPost = bz.bus.posts.getCurrentPost(),
    userId = userId || Meteor.userId();
  if (curPost && userId && !PostBelongsToUser(postOwnerId)) {
    if (!PostIsRatedByCurrentUser()) {
      rateObj = {'social.rates': {userId: userId, ts: Date.now(), rating: rateInt}};
     // bz.cols.posts.update(curPost._id, {$push: {'social.rates': {userId: userId, ts: Date.now(), rating: rateInt}}});
    } else {
      //bz.cols.posts.update(curPost._id, { $pop:  { 'social.likes': { userId: userId, ts: Date.now() }}});
    }
  }
  Meteor.call('ratingPostUpdate',curPost._id, rateObj);
  return ret;
};
GetPostRating = function (curPost) {
  var ret,
    userId = Meteor.userId(),
    postObj = curPost || bz.bus.posts.getCurrentPost(),
    foundPost = bz.cols.posts.findOne({
      _id: postObj._id
    });
  var sum = 0, rating;
  if (foundPost && foundPost.social && foundPost.social.rates) {
    _.each(foundPost.social.rates, function (item) {
      if (item.rating) {
        sum += item.rating
      }
    });
    rating = sum / foundPost.social.rates.length;
  }
  return rating;
};

// API:
bz.help.makeNamespace('bz.bus.posts', {
  getCurrentPost: function () {
    var ret, postId = Router.current() && Router.current().params._id;
    if (postId) {
      ret = bz.cols.posts.findOne(postId);
    }
    return ret;
  }
});

//GLOBAL HELPERS:
GetValueJobsSingleData = function(v, selector) {
  var ret,
      selectedElement = v.$(selector).find('.selected');
  
  if(selectedElement) {
    ret = selectedElement.data('value');
  }
  return ret;
};
GetValueJobsMultiData = function(v, selector) {
  var selectedOptions = [];
  v.$(selector).find('.selected').each(function() {
    selectedOptions.push($(this).data('value'));
  });
  return selectedOptions;
};
GetValuePayMethod = function(v, selector) {
  var ret,
      selectElement = v.$(selector).find('[aria-checked="true"]');
  
  if(selectElement) {
    ret = selectElement.data('value');
  }
  return ret;
};
DeterminePostTypeFromView = function(v) {
  //newPostType
  //v.$('.js-post-type-select').val()
  var ret;
  if (newPostType.get() === bz.const.posts.type.ad) {
    ret = v.$('.js-ad-type-select').val();
  } else if (newPostType.get() === bz.const.posts.type.memo) {
    ret = v.$('.js-memo-type-select').val();
  }
  return ret;
}
GetEndDatePost = function(v, start) {
  var val = v.$('.js-post-select-duration').val(),
    ret;

  switch (val) {
    case 'oneDay':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, start.getHours(), start.getMinutes());
      break;
    case 'twoDay':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 2, start.getHours(), start.getMinutes());
      break;
    case 'week':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7, start.getHours(), start.getMinutes());
      break;
    case 'twoWeek':
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 14, start.getHours(), start.getMinutes());
      break;
    case 'month':
      ret = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes());
      break;
    case 'year':
      ret = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate(), start.getHours(), start.getMinutes());
      break;
    default:
      ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 14, start.getHours(), start.getMinutes());
      console.log('Default value: ', ret);
      break;
  }
  return ret && ret.getTime();
};

// CLASSES:
class PostImagesArray {

}