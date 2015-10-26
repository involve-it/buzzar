/**
 * Created by Ashot on 9/19/15.
 */
const SEARCH_RADIUS = 4000; // 1km ~ 10 min walk
bz.help.makeNamespace('bz.bus.search');


Meteor.startup(function () {
  Tracker.autorun(function(){
    if(GoogleMaps.loaded()){
      bz.help.maps.initGeocoding();
      bz.help.maps.initLocation();
    }
  });

  Session.set('bz.control.search.distance', 1);
  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('bz.control.search.location', {
      coords: loc,
      placeType: bz.const.locations.type.STATIC,
      name: bz.const.places.CURRENT_LOCATION,
      userId: Meteor.userId(),
      public: false // private, user's place

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
  searchPostsReactive();

  bz.help.maps.initPlacesCollection();
  Template.bzControlSearch.onCreated(function () {

    //bz.help.maps.initLocation();

    // doc.ready happened, so:
    //bz.help.maps.googleMapsLoad();
  });


  // fill google maps locations into bz.runtime.maps.places:
  Tracker.autorun(function () {
    //bz.help.maps.initPlacesCollection();
    bz.runtime.maps.places._collection.remove({});
    if (Session.get('bz.control.search.location')) {
      if (GoogleMaps.loaded()) {
        fillNearByPlacesFromLocationGoogle(Session.get('bz.control.search.location'), SEARCH_RADIUS);
      }

      //fillNearByPlacesFromLocationYelp(Session.get('bz.control.search.location'), SEARCH_RADIUS);
    }
  });
});

bz.bus.search.doSearch = function(callback){
  var searchedText = Session.get('bz.control.search.searchedText');
  searchedText = searchedText && searchedText.trim();
  if (searchedText) {
    var query = {},
    //map = GoogleMaps.maps.map.instance, latitude, longitude,
        activeCats = Session.get('bz.control.category-list.activeCategories') || [],
        searchDistance = Session.get('bz.control.search.distance'),
        location = Session.get('bz.control.search.location') || {};
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

      if (callback && typeof callback === 'function'){
        callback(err, results);
      }
    });
  } else {

  }
};

function searchPostsReactive() {
  Tracker.autorun(function () {
    bz.cols.searchRt._collection.remove({});
    bz.cols.posts.find().count();
    bz.bus.search.doSearch();
  });
}
setSearchedText = function (text) {
  return Session.set('bz.control.search.searchedText', text);
}

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

createLocationFromObject = function(obj){
  var ret, toRemove,
    locName = obj.name, coords = obj.coords;
    // save to locations history collection

    if (locName && Meteor.userId()) {
      ret = {
        userId: Meteor.userId(),
        name: locName,
        coords: coords,
        placeType: bz.const.locations.type.STATIC,
        public: false,
        timestamp: Date.now()
      }
      toRemove = bz.cols.locations.findOne({
        name: locName,
        userId: Meteor.userId()
      });
      if(toRemove) {
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
}
setLocationToSessionFromData = function(locName, data, sessionName){
  var placeType;
  if(sessionName === bz.const.posts.location2) {
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
    Session.set(sessionName, data.selectedPlace);
  } else if (data.locationId) {
    locId = data.locationId;
    // if selected from most recent: search product by id in our database
    bzPlace = bz.cols.locations.findOne(locId);
    if (bzPlace) {
      Session.set(sessionName, bzPlace)
    } else {
      bz.help.logError('Location with id ' + locId + 'was not found!');
    }
  } else if (data.isCurrentLocation){
    // selected moving location type
    bz.help.maps.getCurrentLocation(function (loc) {
      if (placeType === bz.const.locations.type.DYNAMIC) {
        Session.set(sessionName, {
          coords: loc,
          placeType: placeType,
          name: bz.const.places.CURRENT_LOCATION,
          userId: Meteor.userId(),
          public: false // private, user's place
        });
      } else {
        bz.help.maps.getAddressFromCoords(loc).done(function(address){
          var locObj = createLocationFromObject({
            name: address,
            coords: loc
          });
          Session.set(sessionName, locObj);
        });
      }
    });
  } else {
    // user entered his own text: this is not our place and we just have a name OR address
    // check if this is an address with geocoding:
    bz.help.maps.getCoordsFromAddress(locName).done(function(coords){
      if(coords){
        res = createLocationFromObject({
          name: locName,
          coords: coords
        });
        Session.set(sessionName, res);
      } else {
        bz.help.maps.getCurrentLocation(function (loc) {
          res = createLocationFromObject({
            name: locName,
            coords: loc
          });
          Session.set(sessionName, res);
        });
      }
    });
  }
}