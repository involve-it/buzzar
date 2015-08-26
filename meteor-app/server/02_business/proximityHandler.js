/**
 * Created by syurdor on 8/26/2015.
 */
//earth radius
var R = 3961;
//ad search radius (box, actually)
var radius = 2;
bz.bus.proximityHandler = {
    getNearbyPosts: function(userId, lat, lng){

        var dLat = (radius/R) / Math.PI * 180;
        var dLng = (radius/R/Math.cos(lat*Math.PI / 180)) / Math.PI * 180;

        var box = {
            lng1: lng - dLng,
            lng2: lng + dLng,
            lat1: lat - dLat,
            lat2: lat + dLat
        };

        return bz.cols.posts.find({
            'details.locations': {
                $elemMatch: {
                    'coords.lat': {$gte: box.lat1, $lte: box.lat2},
                    'coords.lng': {$gte: box.lng1, $lte: box.lng2}
                }
            }
        }).fetch();
    },
    distance: function(lat1, lon1, lat2, lon2) {
        var radlat1 = lat1 * Math.PI/180;
        var radlon1 = lon1 * Math.PI/180;
        var radlat2 = lat2 * Math.PI/180;
        var radlon2 = lon2 * Math.PI/180;

        var dlat = radlat2 - radlat1;
        var dlon = radlon2 - radlon1;

        var a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(dlon/2),2);
        var c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
         // great circle distance in miles
        return c * R;
    }
};