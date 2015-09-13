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
    this.getLocation(function(loc){
      debugger;
      Session.set('loc', loc);
    }, 22, 33);
    //}
  },
  getLocation: function(callback){
    var args = Array.prototype.slice.apply(arguments).slice(1);
    navigator.geolocation.getCurrentPosition(function (a) {
      //bz.runtime.maps.currentGeoposition = a;
      var loc = {
        lat: a.coords.latitude,
        lng: a.coords.longitude
      };
      //bz.runtime.maps.loc = loc;
      debugger;

      callback.apply(this, args.unshift(loc));
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
