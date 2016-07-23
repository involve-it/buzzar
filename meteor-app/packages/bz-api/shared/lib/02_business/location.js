/**
 * Created by syurdor on 11/2/2015.
 */

var helperFunctions = {
  getDistance: function(lat1, lon1, lat2, lon2) {
    var radlat1 = lat1 * Math.PI/180;
    var radlon1 = lon1 * Math.PI/180;
    var radlat2 = lat2 * Math.PI/180;
    var radlon2 = lon2 * Math.PI/180;

    var dlat = radlat2 - radlat1;
    var dlon = radlon2 - radlon1;

    var a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(dlon/2),2);
    var c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
    // great circle distance in miles
    return c * bz.const.locations.earthRadius;
  },
  getCurrentLocation: function(){
    var currentLoc = Session.get('currentLocation');
    if (currentLoc) {
      currentLoc = {
        lat: currentLoc.latitude,
        lng: currentLoc.longitude
      };
    } else {
      currentLoc = Session.get('bz.control.search.location');
      if (currentLoc) {
        currentLoc = currentLoc.coords;
      }
    }
    return currentLoc;
  }
};

bz.help.makeNamespace('bz.help.location', helperFunctions);