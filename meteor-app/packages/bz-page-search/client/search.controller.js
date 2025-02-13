/**
 * Created by Ashot on 9/19/15.
 */
const GOOGLE_LOCALS_SEARCH_RADIUS = 4000; // 1km ~ 10 min walk
bz.help.makeNamespace('bz.bus.search');


Meteor.startup(function () {
  Tracker.autorun(function () {
    if (GoogleMaps.loaded()) {
      bz.help.maps.initGeocoding();
      bz.help.maps.initLocation();
    }
  });

  //Set default distance
  Session.set('bz.control.search.distance', 20);

  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('currentLocation', {
      latitude: loc.lat,
      longitude: loc.lng
    });

    Tracker.autorun(function () {
      var computationAddress = Session.get('getAccurateAddress');

      if(computationAddress) {
        Session.set('bz.control.search.location', {
          coords: loc,
          placeType: bz.const.locations.type.STATIC,
          name: computationAddress.name,
          accurateAddress: computationAddress.accurateAddress,
          userId: Meteor.userId(),
          public: false // private, user's place
        });
      }
    });

  });

  if (!bz.cols.searchRt && !bz.help.collectionExists('bz.cols.searchRt')) {
    var placesCol = new Meteor.Collection("bz.cols.searchRt"); // client-side only.
    bz.help.makeNamespace('bz.cols.searchRt', placesCol);
    bz.cols.searchRt.helpers({
          _hasLivePresence: bz.help.posts.hasLivePresence
        }
    );
  }
  //searchPostsReactive();
  bz.help.maps.initPlacesCollection();
  Template.bzControlSearch && Template.bzControlSearch.onCreated(function () {

    //bz.help.maps.initLocation();

    // doc.ready happened, so:
    //bz.help.maps.googleMapsLoad();
  });
  // fill google maps locations into bz.runtime.maps.places:
  Tracker.autorun(function () {
    if (bz.runtime.maps) {
      bz.runtime.maps.places._collection.remove({});
      if (Session.get('bz.control.search.location')) {
        if (GoogleMaps.loaded()) {
          fillNearByPlacesFromLocationGoogle(Session.get('bz.control.search.location'), GOOGLE_LOCALS_SEARCH_RADIUS);
        }
      }
    }
  });
});
bz.bus.search.showMorePosts=()=>{
  var limit;
  if (Session.get('bz.control.search.postCountLimit')){
    limit=Session.get('bz.control.search.postCountLimit') + 15;
    Session.set('bz.control.search.postCountLimit', limit)
  }
};
bz.bus.search.searchePostsAroundAndPopular = () => {
  var ret, aroundYouSmall, aroundYou, popular, ids=[], arrTags=[],tagCategory, arrTypes, aroundYouLimit=15, aroundYouSmallQuery= {}, aroundYouQuery= {}, popularQuery= {}, box,loc, activeCats, radius, textSearch;
  loc = Session.get('bz.control.search.location');
  radius = Session.get('bz.control.search.distance') || [];
  activeCats = Session.get('bz.control.category-list.activeCategories') || [];
  textSearch = Session.get('bz.control.search.searchedText');

  //Test function to search for posts by tag
  //only works on the page /tags
  if (location.href.indexOf('/tags')!== -1){
    tagCategory=Session.get('bz.search.tag-category');
    arrTags=Session.get('bz.search.tag-related');
    if(tagCategory && tagCategory!="all"){
      if(arrTags!=[""] && arrTags && arrTags!=""){
        arrTags.push(tagCategory);
      }else{
        arrTags=[];
        arrTags.push(tagCategory);
      }
      aroundYouSmallQuery['tags']={$all: arrTags};
      aroundYouQuery['tags']={$all: arrTags};
      popularQuery['tags']={$all: arrTags};
    }else{
      if(arrTags!=[""] && arrTags && arrTags!=""){
        aroundYouSmallQuery['tags']={$all: arrTags};
        aroundYouQuery['tags']={$all: arrTags};
        popularQuery['tags']={$all: arrTags};
      }
    }
  }
  //end test function

  if (Session.get('bz.control.search.postCountLimit')){
    aroundYouLimit = Session.get('bz.control.search.postCountLimit');
  } else{
    Session.set('bz.control.search.postCountLimit', aroundYouLimit)
  }
  if (loc && loc.coords && loc.coords.lat && loc.coords.lng) {
    box = getLatLngBox(loc.coords.lat, loc.coords.lng, radius);
    if (box) {
      aroundYouSmallQuery['details.locations'] = {
        $elemMatch: {
          'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
          'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
        }
      };
      aroundYouQuery['details.locations'] = {
        $elemMatch: {
          'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
          'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
        }
      }
    }
  }
  if (activeCats && Array.isArray(activeCats) && activeCats.length > 0) {
    aroundYouSmallQuery['type'] = {$in: activeCats};
    aroundYouQuery['type'] = {$in: activeCats};
    popularQuery['type'] = {$in: activeCats};
  } else {
    arrTypes = _.map(bz.cols.postAdTypes.find().fetch(), function (item) {
      return item.name;
    });
    arrTypes.push(undefined);
    arrTypes.push('');
    aroundYouSmallQuery['type'] = {$in: arrTypes};
    aroundYouQuery['type'] = {$in: arrTypes};
    popularQuery['type'] = {$in: arrTypes}
  }
  aroundYouSmallQuery['$where'] = function(){
    var a = aroundYouSmallQuery;
    return !!bz.help.posts.hasLivePresence.apply(this)
  };
  // get only non-expired posts (if no value provided in call):
  if (!aroundYouSmallQuery['endDatePost']) {
    aroundYouSmallQuery['endDatePost'] = { $gte : Date.now() }
  }
  aroundYouSmall = bz.cols.posts.find(aroundYouSmallQuery, {sort: {'stats.seenTotal': -1},limit: 10}).fetch();
  ids.push(undefined);
  ids.push('');
  _.each(aroundYouSmall, function(post){ ids.push(post._id)});
  if (textSearch) {
    aroundYouQuery['$or'] = [
      {'details.title': {$regex: `.*${textSearch}.*`}},
      {'details.description': {$regex: `.*${textSearch}.*`}},
      {'details.price': {$regex: `.*${textSearch}.*`}}
    ]
  }else{
    aroundYouQuery['_id']={$nin: ids};
  }
  aroundYouQuery['$where'] = function(){return this.status.visible !== null};
  // get only non-expired posts (if no value provided in call):
  if (!aroundYouQuery['endDatePost']) {
    aroundYouQuery['endDatePost'] = { $gte : Date.now() }
  }
  aroundYou= bz.cols.posts.find(aroundYouQuery, {sort: {'stats.seenTotal': -1},limit: aroundYouLimit}).fetch();
  _.each(aroundYou, function(post){ids.push(post._id)});
  popularQuery['$where'] = function(){return (this.status) ? this.status.visible !== null : false};
  popularQuery['_id']={$nin: ids};
  //popular = bz.cols.posts.find(popularQuery,{sort: {'stats.seenTotal': -1},limit: bz.const.search.POPULAR_LIMIT}).fetch();
  ret = {
    aroundYouSmall: aroundYouSmall,
    aroundYou: aroundYou,
    //popular: popular
  };
  return ret;
};
/*
 bz.bus.search.doSearchClient = (params, options)=> {
 var ret, arrTypes, box, dbQuery = {}, loc = params.loc, activeCats = params.activeCats, radius = params.radius, $where = params.$where, text = params.text;

 if (loc && loc.coords && loc.coords.lat && loc.coords.lng) {
 box = getLatLngBox(loc.coords.lat, loc.coords.lng, radius);

 if (box) {
 dbQuery['details.locations'] = {
 $elemMatch: {
 'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
 'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
 }
 }
 }
 }
 if (text) {
 dbQuery['$or'] = [
 {'details.title': {$regex: `.*${text}.*`}},
 {'details.description': {$regex: `.*${text}.*`}},
 {'details.price': {$regex: `.*${text}.*`}}
 ]
 }
 if (activeCats && Array.isArray(activeCats) && activeCats.length > 0) {
 dbQuery['type'] = {$in: activeCats};
 } else {
 arrTypes = _.map(bz.cols.postAdTypes.find().fetch(), function (item) {
 return item.name;
 });
 arrTypes.push(undefined);
 arrTypes.push('');
 dbQuery['type'] = {$in: arrTypes}
 }
 if (params.$where) {
 dbQuery['$where'] = params.$where;
 }

 _.extend(dbQuery, params.query);
 ret = bz.cols.posts.find(dbQuery, options);

 return ret;
 };
 */
bz.bus.search.doSearchServer = function (options, callback) {
  var searchedText = options.text;
  searchedText = searchedText && searchedText.trim();
  if (searchedText) {
    var query = {},
    //map = GoogleMaps.maps.map.instance, latitude, longitude,
        activeCats = options.cats || [],
        searchDistance = options.dist,
        location = options.loc || {};
    if (!searchedText && searchedText === undefined) {
      searchedText = '';
    }
    query = {
      text: searchedText,
      distance: searchDistance,
      activeCats: activeCats,
      location: location.coords,
      limit: 10
    };

    Meteor.call('search', query, function (err, results) {
      bz.cols.searchRt._collection.remove({});
      if (results && results.length > 0) {
        for (var i = 0; i < results.length; i++) {
          bz.cols.searchRt._collection.upsert({_id: results[i]._id}, results[i]);
        }
      }

      if (callback && typeof callback === 'function') {
        callback(err, results);
      }
    });
  } else {

  }
};

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
};

function searchPostsReactive() {
  // this function will run on every page, tracking "bz.cols.posts.find()". Danger!
  Tracker.autorun(function () {
    //bz.cols.searchRt._collection.remove({});
    //bz.cols.posts.find().count();
    bz.bus.search.doSearchServer({
      text: Session.get('bz.control.search.searchedText'),
      cats: Session.get('bz.control.category-list.activeCategories'),
      dist: Session.get('bz.control.search.distance'),
      loc: Session.get('bz.control.search.location')
    });
  });
}

setSearchedText = function (text) {
  return Session.set('bz.control.search.searchedText', text);
};

// HELPERS:
function fillNearByPlacesFromLocationYelp(loc, radius) {
  /*var map = document.createElement('div');
   var service = new google.maps.places.PlacesService(map);
   service.nearbySearch({
   location: loc.coords,
   radius: radius,
   //types: ['store']
   }, callbackNearbySearchYelp);*/
  callbackNearbySearchYelp(window.yelpRes.businesses, 'OK'); // stub, todo
}

function callbackNearbySearchYelp(results, status) {
  if (status === 'OK') {
    for (var i = 0; i < results.length; i++) {
      results[i].searchEngine = 'yelp';
      bz.runtime.maps.places._collection.upsert({name: results[i].name}, results[i]);
    }
  }
  //Session.set('bz.control.search.places', bz.runtime.maps.places.find().fetch());
  //return bz.runtime.maps.places;
}

function fillNearByPlacesFromLocationGoogle(loc, radius) {
  var map = document.createElement('div');
  var service = new google.maps.places.PlacesService(map);
  /*service.nearbySearch({
   location: loc.coords,
   radius: radius,
   //types: ['store']
   }, callbackNearbySearch);*/
  //console.log(radius);
  service.nearbySearch({
    //service.radarSearch({
    location: loc.coords,
    radius: radius
    //types: allTypes
  }, callbackNearbySearchGoogle);
}

function callbackNearbySearchGoogle(results, status, html_attributions, next_page_token) {
  if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
    res1 = _.filter(results, function (item) {
      return _.intersection(['locality'], item.types).length === 0;
    });
    results = res1;
    //console.log(res1.length);
    for (var i = 0; i < results.length; i++) {
      //console.log(results[i])
      results[i].searchEngine = 'google';

      bz.runtime.maps.places._collection.upsert({name: results[i].name}, results[i]);
    }
  }
  //Session.set('bz.control.search.places', bz.runtime.maps.places.find().fetch());
  //return bz.runtime.maps.places;
}

createLocationFromObject = function (obj) {


  var ret, toRemove,
      locName = obj.name, coords = obj.coords;
  var currentAddress = obj.accurateAddress;

  // save to locations history collection

  //console.log('get 2');

  if (locName && Meteor.userId()) {

    ret = {
      userId: Meteor.userId(),
      name: locName,
      accurateAddress: currentAddress,
      coords: coords,
      placeType: bz.const.locations.type.STATIC,
      public: false,
      timestamp: Date.now()
    };

    //console.info('ret', ret);

    toRemove = bz.cols.locations.findOne({
      name: locName, userId: Meteor.userId()
      /*$or: [
       {accurateAddress: currentAddress, userId: Meteor.userId()},
       {name: locName, userId: Meteor.userId()}
       ]*/
    });

    if (toRemove) {
      bz.cols.locations.remove(toRemove._id);
    }

    ret._id = bz.cols.locations.insert(ret);

  } else if(locName) {

    //console.log('get 3');

    /* without user sign in */
    ret = {
      name: locName,
      accurateAddress: currentAddress,
      coords: coords,
      placeType: bz.const.locations.type.STATIC,
      public: false,
      timestamp: Date.now()
    };

    toRemove = bz.cols.locations.findOne({
      name: locName

      /*$or: [
       {accurateAddress: currentAddress},
       {name: locName}
       ]*/
    });

    if (toRemove) {
      bz.cols.locations.remove(toRemove._id);
    }

    ret._id = bz.cols.locations.insert(ret);
  }
  //ret.resolve(true);
  /*} else {
   ret.resolve(false);
   }*/
  // 2. set sitewide current location:

  return ret;
};

setLocationToSessionFromData = function (locName, data, sessionName) {

  var placeType, resolveProm, resPromise = new Promise((resolve, reject) => {
    resolveProm = resolve;
  });
  if (sessionName === bz.const.posts.location2) {
    placeType = bz.const.locations.type.STATIC;
  } else if (sessionName === bz.const.posts.location1) {
    placeType = bz.const.locations.type.DYNAMIC;
  }
  var locId, bzPlace, res;
  // do something with the result:
  //Session.get('bz.control.search.location')
  //console.log(this.locationId);
  sessionName = sessionName || 'bz.control.search.location';
  if (data.selectedPlace) {
    // if selected from a dropdown:
    res = data.selectedPlace;
    Session.set(sessionName, res);
    resolveProm(res);
  } else if (data.locationId) {
    locId = data.locationId;
    // if selected from most recent: search product by id in our database
    bzPlace = bz.cols.locations.findOne(locId);
    if (bzPlace) {
      res = bzPlace;
      Session.set(sessionName, res);
      resolveProm(res);
    } else {
      bz.help.logError('Location with id ' + locId + 'was not found!');
    }
  } else if (data.isCurrentLocation) {

    // selected moving location type
    bz.help.maps.getCurrentLocation(function (loc) {
      if (placeType === bz.const.locations.type.DYNAMIC) {
        //var location = Session.get('getAccurateAddress') || T9n.get('MY_LOCATION_TEXT');
        var location = Session.get('getAccurateAddress'); //|| T9n.get('MY_LOCATION_TEXT');
        res = {
          coords: loc,
          placeType: placeType,
          name: location.name,
          accurateAddress: location.accurateAddress,
          userId: Meteor.userId(),
          public: false // private, user's place
        };
        Session.set(sessionName, res);
        resolveProm(res);
      } else {

        //console.log('loc 2');
        // set address in sessionName

        bz.help.maps.getAddressFromCoords(loc).done(function (address, accurateAddress) {
          res = createLocationFromObject({
            name: address,
            accurateAddress: accurateAddress,
            coords: loc
          });
          Session.set(sessionName, res);
          resolveProm(res);
        });
      }
    });
  } else {
    // user entered his own text: this is not our place and we just have a name OR address
    // check if this is an address with geocoding:
    bz.help.maps.getCoordsFromAddress(locName).done(function (coords) {
      if (coords) {
        res = createLocationFromObject({
          name: locName,
          coords: coords
        });
        Session.set(sessionName, res);
        resolveProm(res);
      } else {
        bz.help.maps.getCurrentLocation(function (loc) {
          res = createLocationFromObject({
            name: locName,
            coords: loc
          });
          Session.set(sessionName, res);
          resolveProm(res);
        });
      }
    });
  }

  return resPromise;
};