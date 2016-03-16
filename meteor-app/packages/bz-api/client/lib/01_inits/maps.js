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

    /*var loc = {
     lat: 37.3213,
     lng: -121.81649
     };
     args.unshift(loc)
     callback.apply(that, args);
     return;*/
    
    
    // check navigation
    if(navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geo_success, geo_error);
    } else {
      console.info('Геолакация не поддерживается.');
    }
    
    function geo_success(a) {
        //bz.runtime.maps.currentGeoposition = a;
        var loc = {
          lat: a.coords.latitude,
          lng: a.coords.longitude
        };
        //bz.runtime.maps.loc = loc;
        args.unshift(loc);
        Session.set('bz.api.maps.recentLoc', loc);
        callback.apply(that, args);
    }
    
    function geo_error(error) {
      if(error.code == 1) {
        console.info('Пользователь запретил определять свое местоположение.');
      } else if(error.code == 2) {
        console.info('Географическая информация недоступна');
        console.info(error);
      } else if(error.code == 3) {
        console.info('Во время запроса произошла неизвестная ошибка.');
      }
    }
  },
  initPlacesCollection: function () {
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
  },
  initGeocoding: function () {
    geocoder = new google.maps.Geocoder();
  },
  getCoordsFromAddress: function (address) {
    var ret = $.Deferred(), coords;

    if (!address || !geocoder) {
      bz.ui.error('Error occured');
      bz.help.logError('Error with address or geocoder in getCoordsFromAddress');
      ret.reject();
    } else {
      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results.length > 1) {
            bz.help.logError('more than 1 result in geocoding!');
          }
          coords = googleCoordsToNormalCoords(results[0].geometry.location);

          ret.resolve(coords);
        } else {
          ret.resolve(undefined);
          bz.ui.error('Error occured');
          bz.help.logError("bz.api.maps: Geocode was not successful for the following reason: " + status);
        }
      });
    }
    return ret;
  },
  getAddressFromCoords: function (coords) {
    var ret = $.Deferred(), address;
    if (geocoder) {
      var latLng = {lat: parseFloat(coords.lat), lng: parseFloat(coords.lng)};
      geocoder.geocode({
        'location': latLng
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK && results[1]) {
          address = results[1].formatted_address;
          ret.resolve(address);
        } else {
          ret.resolve(undefined);
          bz.help.logError("bz.api.maps: ReverseGeocode was not successful for the following reason: " + status);
        }
      });
    } else {
      ret.reject();
    }
    return ret;
  }
};

googleCoordsToNormalCoords = function (googleCoords) {
  var coords;
  if (Number.parseFloat(googleCoords.J)) { // stupid ..
    coords = {
      lat: googleCoords.J,
      lng: googleCoords.M
    }
  } else if (typeof googleCoords.lat === 'function' && Number.parseFloat(googleCoords.lat())) { // .. google
    coords = {
      lat: googleCoords.lat(),
      lng: googleCoords.lng()
    }
  }
  return coords;
}

bz.help.makeNamespace('bz.help.maps', Maps);
bz.help.maps.googleCoordsToNormalCoords = googleCoordsToNormalCoords;

