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
    otherKeyValuePairs = [], timestamp;

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
    var newPost = {

      userId: userId,
      type: v.$('.js-post-type-select').val(),
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
      timestamp: timestamp
    }

    //$.when(locDef).then(function () {
    Meteor.call('addNewPost', newPost, function (err, res) {
      if (!err && res && res !== '') {
        clearPostData();
        bz.runtime.newPost.postId = res;
        Router.go('/posts/my');
      }
    });
  }
}
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
      })
      /*locationsArr.push({
       coords: loc,
       type: bz.const.locations.type.STATIC
       });
       locDef.resolve();*/
    });
    //Template.bzLocationNameNewPost.showModal();
  }
}
staticLocationPanelClick = function () {
  var chosenLocation = Session.get(location2.sessionName);
  if (!chosenLocation) {
    // nothing is set as a location, need to set it, for this show user location-choose control:
    //$('.js-location-holder a').click();
    Template.bzLocationNameNewPost.showModal();
  }
}
userSeenAll;
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
}

//HELPERS:
function clearPostData() {

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
}
location2 = {
  isSet: false,
  sessionName: 'bz.posts.new.location2',
  dbObject: undefined,
  setLocation: function (dbObject) {
    this.isSet = true;
    this.dbObject = dbObject;
    Session.set(this.sessionName, dbObject);
  }
}

getPostPhotoObjectsByIds = function(photoIds){
  var photos = photoIds, ret = [];
  _.each(photos, function(id){
    ret.push(bz.cols.images.findOne(id));
  });
  return ret;
}