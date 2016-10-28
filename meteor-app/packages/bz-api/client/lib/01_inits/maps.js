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
  getIframeCoordinates: function() {
    var ret;
    if (bz.help.getParamURL().isiframe && bz.help.getParamURL().lng && bz.help.getParamURL().lat) {
      ret = {
        lat: parseFloat(bz.help.getParamURL().lat),
        lng: parseFloat(bz.help.getParamURL().lng)
      }
    } else if (Session.get('iframeObject') && Session.get('iframeObject').lng && Session.get('iframeObject').lat) {
      ret = {
        lat: parseFloat(parseFloat(Session.get('iframeObject').lat)),
        lng: parseFloat(parseFloat(Session.get('iframeObject').lng))
      }
    }
    return ret;
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

    if (bz.help.maps.getIframeCoordinates()) {
      geo_success({
        coords: {
          latitude: bz.help.maps.getIframeCoordinates().lat,
          longitude: bz.help.maps.getIframeCoordinates().lng
        }
      })
    } else {
      // check navigation
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geo_success, geo_error);
      } else {
        console.info('Geolocation is not supported.');
      }
    }
    //console.info('2: getCurrentLocation');
    
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
        console.info('User is banned location.');
      } else if(error.code == 2) {
        console.info('Geographic information is not available.');
      } else if(error.code == 3) {
        console.info('During request unknown error occurred.');
      }
    }
    
    
  },
  initPlacesCollection: function () {
    if (bz.runtime.maps) {
      if (!bz.runtime.maps.places && !bz.help.collectionExists('maps.places')) {

        var placesCol = new Meteor.Collection("maps.places"); // client-side only.
        bz.help.makeNamespace('bz.runtime.maps.places', placesCol);
      }
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

    //console.info('4.0 geocoder: ', geocoder);
    
    var coords = Session.get('currentLocation'), loc, ret = {};
    
    if(coords) {
      loc = {lat: coords.latitude, lng: coords.longitude};
      bz.help.maps.getAddressFromCoords(loc).done(function (address, accurateAddress) {
        ret = {
          accurateAddress: accurateAddress,
          name: address,
          coords: loc
        };
        
        //console.info('4.1 setGetAccurateAdress');
        
        Session.set('getAccurateAddress', {
          name: ret.name,
          accurateAddress: ret.accurateAddress
        });
        /*Session.set('bz.control.search.location', {
          coords: loc,
          name: ret.name,
          accurateAddress: ret.accurateAddress
        });*/
      });
    }
    
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
    var ret = $.Deferred(), address, accurateAddress;
    if (geocoder) {
      var latLng = {lat: parseFloat(coords.lat), lng: parseFloat(coords.lng)};
      geocoder.geocode({
        'location': latLng
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK && results[1]) {
          accurateAddress = results[0].address_components[1].short_name;
          address = results[1].formatted_address;
          
          //console.info(results);
          
          ret.resolve(address, accurateAddress);
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

