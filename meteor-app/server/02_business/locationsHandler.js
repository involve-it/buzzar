/**
 * Created by xvolkx48 on 26.05.2016.
 */
bz.bus.locationsHandler={
  getLatLngBox: function (lat, lng, radius){
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
  }
};