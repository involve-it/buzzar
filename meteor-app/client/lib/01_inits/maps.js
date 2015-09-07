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
    bz.runtime.maps = {}
    //if(!Meteor.isCordova) {
    navigator.geolocation.getCurrentPosition(function (a) {
      //bz.runtime.maps.currentGeoposition = a;
      bz.runtime.maps.loc = {
        lat: a.coords.latitude,
        lng: a.coords.longitude
      };
      Session.set('loc', bz.runtime.maps.loc);
    });
    //}
  },
  initPlaces: function(){
    var placesCol = new Meteor.Collection("maps.places"); // client-side only.
    bz.help.makeNamespace('bz.runtime.maps.places', placesCol);
  },
  googleMapsLoad: function () {      // need run after doc.ready
    if(!GoogleMaps.loaded()){
      GoogleMaps.load({
        //key: bz.config.mapsKey,
        libraries: 'places'  // also accepts an array if you need more than one
      });
    }
  }
}
bz.help.makeNamespace('bz.help.maps', Maps);
