/**
 * Created by syurdor on 8/26/2015.
 */
//earth radius
var R = 3961;
//ad search radius (box, actually)
var defaultRadius = 1,
    nearbyRadius = 0.5;

Meteor.onConnection(function(connection){
    //console.log('Connected: ' + connection.id);
    var connectionId = connection.id;
    connection.onClose(function(){
        //console.log('Disconnected: ' + connectionId);
        var user = Meteor.users.findOne({'lastSessionId': connectionId});
        if (user){
            //console.log('Found userId: ' + user._id);
            bz.bus.proximityHandler.processUserDisconnect(user._id);
        }
    });
});

bz.bus.proximityHandler = {
    reportLocation: function(report){
        //console.log('Location reported for userId: ' + report.userId + ', sessionId: ' + report.sessionId + ', lat: ' + report.lat + ', lng: ' + report.lng);
        var posts = bz.cols.posts.find({
            userId: report.userId
        }).fetch();
        //var filtered = bz.bus.proximityHandler.filterCircularPosts(posts, lat, lng, nearbyRadius);
        //var ids = _.pluck(filtered, '_id');
        //bz.cols.posts.update({'_id': {$in: ids}}, {$set: {presence: bz.const.posts.status.presence.NEAR}});
        bz.bus.proximityHandler.processLocationReport(posts, report.lat, report.lng);

        var user = Meteor.users.findOne({'_id': report.userId});
        if (user){
            Meteor.users.update({'_id': report.userId},{
                $set: {
                    lastSessionId: report.sessionId
                }
            });
        }
    },
    //following function is not being used
    /*reportLocation: function(userId, lat, lng){
        var posts = bz.bus.proximityHandler.getNearbyPosts(lat, lng),
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
        return posts;
    },*/
    processUserDisconnect: function(userId){
        //console.log('Disconnected');
        var posts = bz.cols.posts.find({
            userId: userId
        }).fetch(),
            updated;
        _.each(posts, function(post){
            if (post && post.details && post.details.locations && Array.isArray(post.details.locations)){
                updated = false;
                bz.cols.posts.update({'_id': post._id}, {$set:{presenses: []}});
            }
        });
    },
    processLocationReport: function(posts, lat, lng){
        var updated;
        _.each(posts, function(post){
            if (post && post.details && post.details.locations && Array.isArray(post.details.locations)){
                updated = false;
                var presenses = {};
                _.each(post.details.locations, function(loc){
                    if (loc.placeType === bz.const.locations.type.DYNAMIC){
                        if (loc.coords.lat !== lat || loc.coords.lng != lng) {
                            //console.log('Updating moving coordinates for ad: ' + post.details.title);
                            loc.coords = {
                                lat: lat,
                                lng: lng,
                                timestamp: new Date()
                            };
                            updated = true;
                        }
                        presenses[loc._id] = bz.const.posts.status.presence.NEAR;
                    } else {
                        if (bz.bus.proximityHandler.withinRadius(lat, lng, nearbyRadius, loc)) {
                            //console.log('Changing status to Near for ad: ' + post.details.title);
                            updated = true;
                            presenses[loc._id] = bz.const.posts.status.presence.NEAR;
                        }
                    }
                });
                if (updated){
                    bz.cols.posts.update({'_id': post._id}, {$set: {presenses: presenses}});
                }
            }
        });
    },
    getNearbyPosts: function(lat, lng){
        var box = bz.bus.proximityHandler.getLatLngBox(lat, lng, defaultRadius);

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
        return bz.bus.proximityHandler.filterCircularPosts(posts, lat, lng, defaultRadius);
    },
    filterCircularPosts: function(posts, lat, lng, radius){
        var results = [],
            found;
        _.each(posts, function(post){
            found = false;
            if (post && post.details && post.details.locations) {
                _.each(post.details.locations, function (loc) {
                    if (bz.bus.proximityHandler.withinRadius(lat, lng, radius, loc)) {
                        found = true;
                        return false;
                    }
                });
                if (found) {
                    results.push(post);
                }
            }
        });
        return results;
    },
    getLatLngBox: function (lat, lng, radius){
        if (lat && lng && radius) {
            var dLat = (radius / R) / Math.PI * 180,
                dLng = (radius / R / Math.cos(lat * Math.PI / 180)) / Math.PI * 180;
            return {
                lng1: lng - dLng,
                lng2: lng + dLng,
                lat1: lat - dLat,
                lat2: lat + dLat
            };
        } else {
            return null;
        }

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
    withinRadius: function(lat, lng, radius, loc){
        return bz.bus.proximityHandler.distance(lat, lng, loc.coords.lat, loc.coords.lng) <= radius;
    }
};