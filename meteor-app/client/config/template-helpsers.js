/**
 * Created by ashot on 8/31/15.
 */
var EARTH_RAD = T9n.getLanguage() === 'en'? 3959 : 6371e3; // radius of Earth, miles/meters
// see this: http://www.movable-type.co.uk/scripts/latlong.html
Template.registerHelper('getDistanceToPost', function (postIn) {
  var ret, post = postIn || this,
      x, y, xcur, ycur, curLoc, dist;
  if (post.details && post.details.locations && post.details.locations[0] && post.details.locations[0].coords) {
    x = post.details.locations[0].coords.lat;
    y = post.details.locations[0].coords.lng;
    if (curLoc = Session.get('currentLocation')) {
      xcur = curLoc.latitude;
      ycur = curLoc.longitude;


      var R = EARTH_RAD;
      var φ1 = xcur.toRadians(),  λ1 = ycur.toRadians();
      var φ2 = x.toRadians(), λ2 = y.toRadians();
      var Δφ = φ2 - φ1;
      var Δλ = λ2 - λ1;

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      ret = Math.round(d);
      //ret = Math.sqrt(Math.pow((xcur - x), 2) + Math.pow((ycur - y), 2));
    }
    /*
     latitude: position.coords.latitude,
     longitude: position.coords.longitude,
     accuracy: position.coords.accuracy*/
    /*navigator.geolocation.getCurrentPosition(function (a) {
     //bz.runtime.maps.currentGeoposition = a;
     bz.runtime.maps.loc = {
     lat: a.coords.latitude,
     lng: a.coords.longitude
     };
     Session.set('loc', bz.runtime.maps.loc);
     });*/
  }
  return ret;
});
