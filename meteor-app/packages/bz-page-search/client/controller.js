/**
 * Created by Ashot on 9/19/15.
 */
const SEARCH_RADIUS = 4000; // 1km ~ 10 min walk
bz.help.makeNamespace('bz.buz.search');


Meteor.startup(function () {
  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('bz.control.search.location', {
      coords: loc,
      name: 'My Location'
    });
  });

  if (!bz.cols.searchRt && !bz.help.collectionExists('bz.cols.searchRt')) {
    var placesCol = new Meteor.Collection("bz.cols.searchRt"); // client-side only.
    bz.help.makeNamespace('bz.cols.searchRt', placesCol);
  }
  searchPostsReactive();

  bz.help.maps.initPlacesCollection();
  Template.bzControlSearch.onCreated(function () {

    bz.help.maps.initLocation();

    // doc.ready happened, so:
    //bz.help.maps.googleMapsLoad();
  });
  Template.bzControlSearch.onCreated(function () {

    bz.help.maps.initLocation();
    //bz.help.maps.initPlacesCollection();

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

      fillNearByPlacesFromLocationYelp(Session.get('bz.control.search.location'), SEARCH_RADIUS);
    }
  });
});


Meteor.startup(function () {

});


function searchPostsReactive() {
  Tracker.autorun(function () {
    bz.cols.searchRt._collection.remove({});
    bz.cols.posts.find().count();
    var searchedText = Session.get('bz.control.search.searchedText');
    searchedText = searchedText && searchedText.trim();
    if (searchedText) {
      var query = searchedText,
      //map = GoogleMaps.maps.map.instance, latitude, longitude,
          activeCats = Session.get('bz.control.category-list.activeCategories');
      if (!query && query === undefined) {
        query = '';
      }
      Meteor.call('search', query, activeCats, {limit: 10}, function (err, results) {
        bz.cols.searchRt._collection.remove({});
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            bz.cols.searchRt._collection.upsert({_id: results[i]._id}, results[i]);
          }
        }
      });
    } else {

    }
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
  debugger;
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
    radius: radius,
    //types: allTypes
  }, callbackNearbySearchGoogle);
}

function callbackNearbySearchGoogle(results, status, html_attributions, next_page_token) {
  if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
    res1 = _.filter(results, function (item) {
      return _.intersection(['locality'], item.types).length === 0;
    });
    results = res1;
    console.log(res1.length);
    for (var i = 0; i < results.length; i++) {
      //console.log(results[i])
      results[i].searchEngine = 'google';

      bz.runtime.maps.places._collection.upsert({name: results[i].name}, results[i]);
    }
  }
  //Session.set('bz.control.search.places', bz.runtime.maps.places.find().fetch());
  //return bz.runtime.maps.places;
}