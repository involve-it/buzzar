/**
 * Created by ashot on 7/26/15.
 */
var defaultDistance = 5,
  defaultLimit = 50;

Meteor.methods({
  getCurrentLocation : function(a, b, c) {
  },
  'bz.user.setLanguage' : function(lang) {
    var ret, user;

    user = Meteor.userId();
    ret = Meteor.users.update({'_id': user}, {
      $set: { 'profile.language': lang }
    });
    return ret;
  },
  'bz.user.getLanguage' : function(detectedLang){
    var ret;
    ret = Meteor.user() && Meteor.user()._getLanguage() || undefined;
    if(!ret && detectedLang){
      a = Meteor.call('bz.user.setLanguage', detectedLang);
      ret = detectedLang;
    }
    return ret;
  },
  parseHtml: function(html) {
    var ret = bz.bus.parseHtml(html);
    return ret;
  },
  parseUrl: function(url) {
    return bz.bus.parseUrl(url);
  },
  addNewPost: function(postObject, currentLocation, connectionId) {
    if(postObject){
      /*if (!postObject.presences && postObject.details && postObject.details.locations && Array.isArray(postObject.details.locations) && postObject.details.locations.length > 0){
        postObject.presences = {};
        var id;
        _.each(postObject.details.locations, function(loc){
          id = loc._id || bz.const.locations.type.DYNAMIC;
          postObject.presences[id] = bz.const.posts.status.presence.NEAR;
        });
      }*/
      var post = bz.cols.posts.insert(postObject);
      if (currentLocation){
        bz.bus.proximityHandler.reportLocation({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          userId: postObject.userId,
          sessionId: connectionId
        });
      }
      return post;
      //return 'EPzoQSGnGCSsPaQjm'
    }
  },
  saveExistingPost: function(postObject, currentLocation, connectionId) {
    var res, ret;
    if(postObject && postObject._id){
      /*if (!postObject.presences && postObject.details && postObject.details.locations && Array.isArray(postObject.details.locations) && postObject.details.locations.length > 0){
        postObject.presences = {};
        var id;
        _.each(postObject.details.locations, function(loc){
          id = loc._id || bz.const.locations.type.DYNAMIC;
          postObject.presences[id] = bz.const.posts.status.presence.NEAR;
        });
      }*/
      res = bz.cols.posts.update(postObject._id, { $set : postObject });
      if (currentLocation){
        bz.bus.proximityHandler.reportLocation({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          userId: postObject.userId,
          sessionId: connectionId
        });
      }
      if (res === 1){
        ret = postObject._id;
      }
      return ret;
      //return 'EPzoQSGnGCSsPaQjm'
    }
  },
  /*searchPostsByParams: function(params, onlyMy){
    if(typeof params === 'boolean') { // first param is omitted, onlyMy is passed.
      onlyMy = params;
      params = undefined;
    }
    var posts, filter = params || {};
    if (onlyMy){
      filter.userId = Meteor.userId();
    }
    posts = bz.cols.posts.find(filter).fetch();
    return posts;
  },*/
  getNearbyPosts: function(userId, lat, lng){
    return bz.bus.proximityHandler.getNearbyPosts(userId, lat, lng);
  },
  reportLocation: function(report){
    return bz.bus.proximityHandler.reportLocation(report);
  },
  logOut: function(userId){
    if (userId) {
      return bz.bus.proximityHandler.processUserDisconnect(userId);
    }
  },
  registerPushToken: function(deviceId, token, userId){
    bz.bus.pushHandler.registerToken(deviceId, token, userId);
  },
  assignTokenToUser: function(deviceId, userId){
    bz.bus.pushHandler.assignTokenToUser(userId, deviceId)
  },
  unassignTokenFromUser: function(deviceId, userId){
    bz.bus.pushHandler.unassignTokenFromUser(userId, deviceId)
  },
  sendMessageContactUs: function(msg, userId){
    // send email here:
    var emailOptions = {
      from: 'info@shiners.ru',
      to: 'info@shiners.ru',
      cc: 'arutune@gmail.com,yury.dorofeev@gmail.com,',
      subject: 'from Buzzar.org: feedback from Contact Us page',
      html: 'Message: ' + msg + '<br> Please contact <a href="'+Meteor.absoluteUrl()+'user/'+userId+'">this user</a>.'
    };
    var ret = bz.cols.contactUsMsgs.insert({
      text: msg,
      options: emailOptions,
      userId: userId //optional
    });

    var res = Email.send(emailOptions);
    return ret;
  },
  setUserCurrentLocation: function (userId, coords) {
    var name = T9n.get('MY_LOCATION_TEXT'), id;
    var existLoc = bz.cols.locations.findOne({name: name, userId: userId});
    if (existLoc) {
      //bz.cols.locations.remove(existLoc._id);
      bz.cols.locations.update(existLoc._id, {
        $set: {
          coords: coords,
          placeType: bz.const.locations.type.DYNAMIC
        }
      });
      id = existLoc._id;
    } else {
      id = bz.cols.locations.insert({
        userId: userId,
        name: name,
        coords: coords,
        placeType: bz.const.locations.type.DYNAMIC
      });
    }

    return bz.cols.locations.findOne(id);
  },
  testNative: function(lat, lng){
    //console.log('Coordinates updated: ' + lat + ', ' + lng);
    return "Success";
  },
  search: function (query, options) {
    /*query = {
     text: searchedText,
     distance: searchDistance,
     activeCats: activeCats
     }*/
    query = query || {};
    options = options || {};

    var textToSearch = query.text || '',
      distance = query.distance || defaultDistance,
      types = query.catTypes;

    // guard against client-side DOS: hard limit to 50
    if (query.limit) {
      options.limit = Math.min(defaultLimit, Math.abs(query.limit));
    } else {
      options.limit = defaultLimit;
    }

    // TODO fix regexp to support multiple tokens
    var regex = new RegExp(".*" + textToSearch + '.*'),
      location = query.location || {},
      box = distance === -1 ? null : (query.box || bz.bus.proximityHandler.getLatLngBox(location.lat, location.lng, distance)),
      dbQuery = {
        'details.title': {$regex: regex, $options: 'i'},
        //'status.visible': bz.const.posts.status.visibility.VISIBLE
      },
      ret,
      typesArr,
      filter = false;
    //categories

    /*if (!(types && Array.isArray(types) && types.length > 0)) {
     types = _.map(bz.cols.postAdTypes.find().fetch(), function(item){ return item.id});
     }*/
    if (query.activeCats && Array.isArray(query.activeCats) && query.activeCats.length > 0) {
      dbQuery.type = {$in: query.activeCats};
    } else {
      typesArr = _.map(bz.cols.postAdTypes.find().fetch(), function(item){ return item.name});
      typesArr.push(undefined, null);
      dbQuery.type = {$in: typesArr}
    }
    //location
    if (box && box.lat1 && box.lat2 && box.lng1 && box.lng2){
      filter = true;
      dbQuery['details.locations'] = {
        $elemMatch: {
          'coords.lat': {$gte: box.lat1, $lte: box.lat2},
          'coords.lng': {$gte: box.lng1, $lte: box.lng2}
        }
      };
    }

    ret = bz.cols.posts.find(dbQuery, options).fetch();
    if (filter){
      ret = bz.bus.proximityHandler.filterCircularPosts(ret, ((box.lat2 - box.lat1)/2) + box.lat1, ((box.lng2 - box.lng1)/2) + box.lng1, distance);
    }


    var activePosts, locations, loc;
    if (options.activeOnly && options.activeOnly === true){
      activePosts = [];
      _.each(ret, function(post){
        if (post && post.details
          && post.details.locations && Array.isArray(post.details.locations) && post.details.locations.length > 0
          && post.presenses && Object.keys(post.presenses).length > 0){
          locations = [];
          _.each(post.presenses, function(presense, i){
            if (presense === bz.const.posts.status.presence.NEAR){
              loc = _.find(post.details.locations, function(loc){
                return (i !== bz.const.locations.type.DYNAMIC && loc._id === i) || (i === bz.const.locations.type.DYNAMIC && !loc._id);
              });
              if (loc){
                locations.push(loc);
              }
            }
          });
          if (locations.length > 0){
            //TODO: confirm correct logic here
            post.details.locations = locations;
            activePosts.push(post);
          }
        }
      });
    } else {
      activePosts = ret;
    }

    return activePosts;
  },
  // function for testing in the console Meteor runtime server-side:
  console: function(){
    debugger;
  }
});

//test comment
// INFO:

// usage on the client:
//Meteor.call('parseHtml', function(error, res) {
//  alert(res);
//})
