/**
 * Created by root on 9/5/15.
 */
/*if (Meteor.isClient) {
 Meteor.startup(function() {
 GoogleMaps.load();
 });
 }*/
var Maps = {
  initLocation: function () {
    bz.help.makeNamespace('bz.runtime.maps');
    this.getCurrentLocation(function (loc) {
      //Session.set('bz.api.loc', loc);
    });
    //}
  },
  getCurrentLocation: function (callback) {
    var args = Array.prototype.slice.apply(arguments).slice(1);
    var that = this;
    var loc = {  //  49 Geary Street, San Francisco, CA
      lat: 37.787923,
      lng: -122.404342
    }
    //args.unshift(loc)
    //callback.apply(that, args);
    navigator.geolocation.getCurrentPosition(function (a) {
     //bz.runtime.maps.currentGeoposition = a;
     var loc = {
     lat: a.coords.latitude,
     lng: a.coords.longitude
     };
     console.log(a);
     //bz.runtime.maps.loc = loc;
     args.unshift(loc);
     Session.set('bz.api.maps.recentLoc', loc);
     callback.apply(that, args);
    });
  },
  initPlaces: function () {
    if (!bz.runtime.maps.places && !bz.help.collectionExists('maps.places')) {

      var placesCol = new Meteor.Collection("maps.places"); // client-side only.
      bz.help.makeNamespace('bz.runtime.maps.places', placesCol);
    }
  },
  googleMapsLoad: function () {      // need run after doc.ready
    if (!GoogleMaps.loaded()) {
      GoogleMaps.load({
        //key: bz.config.mapsKey,
        libraries: 'places'  // also accepts an array if you need more than one
      });
    }
  }
}
bz.help.makeNamespace('bz.help.maps', Maps);
