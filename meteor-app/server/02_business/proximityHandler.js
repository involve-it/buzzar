/**
 * Created by syurdor on 8/26/2015.
 */
//earth radius
var R = 3961;
//ad search radius (box, actually)
var radius = 1;
bz.bus.proximityHandler = {
    reportLocation: function(userId, lat, lng){
        var posts = bz.bus.proximityHandler.getNearbyPosts(userId, lat, lng),
            nearbyPosts = bz.cols.nearbyPosts.find({nearbyUserId: userId}).fetch();
        _.each(nearbyPosts, function(post){
            if (_.find(post.details.locations, function(loc){
                    return bz.bus.proximityHandler.withinRadius(lat, lng, loc);
                })){
                posts = _.filter(posts, function(newPost){
                    return newPost._id != post._id;
                });
            } else {
                bz.cols.nearbyPosts.remove({_id: post._id});
            }
        });

        if (posts.length > 0) {
            _.each(posts, function (post) {
                post.nearbyUserId = userId;
                bz.cols.nearbyPosts.insert(post);
            });
        }
    },
    getNearbyPosts: function(userId, lat, lng){
        var dLat = (radius/R) / Math.PI * 180;
        var dLng = (radius/R/Math.cos(lat*Math.PI / 180)) / Math.PI * 180;

        var box = {
            lng1: lng - dLng,
            lng2: lng + dLng,
            lat1: lat - dLat,
            lat2: lat + dLat
        };

        //this is box-shaped filter for increased performance
        var posts =  bz.cols.posts.find({
            'details.locations': {
                $elemMatch: {
                    'coords.lat': {$gte: box.lat1, $lte: box.lat2},
                    'coords.lng': {$gte: box.lng1, $lte: box.lng2}
                }
            }
        }).fetch();

        //this if circular filter (as opposed to box-shaped above)
        var results = [];
        var found;
        _.each(posts, function(post){
            found = false;
            _.each(post.details.locations, function(loc){
                if (bz.bus.proximityHandler.withinRadius(lat, lng, loc)) {
                    found = true;
                    return false;
                }
            });
            if (found){
                results.push(post);
            }
        });

        return results;
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
    },
    withinRadius: function(lat, lng, loc){
        return bz.bus.proximityHandler.distance(lat, lng, loc.coords.lat, loc.coords.lng) <= radius;
    }
};