/**
 * Created by syurdor on 8/26/2015.
 */

//ad search radius (box, actually)
var defaultRadius = 1,
    nearbyRadius = 0.5;
if (Meteor.isServer) {
    Meteor.onConnection(function (connection) {
        //console.info('Connected: ' + connection.id);
        var connectionId = connection.id;
        connection.onClose(function () {
            //console.info('Disconnected: ' + connectionId);
            var user = Meteor.users.findOne({'sessionIds': connectionId});
            if (user) {
                //console.info('Found userId: ' + user._id);
                bz.bus.proximityHandler.processUserDisconnect(user._id, connectionId);
            }
        });
    });
}
bz.bus.proximityHandler = {
    isUserOnline: function(userId){
        /*var sockets = Meteor.default_server.stream_server.open_sockets;
        return _.any(sockets,function(socket){
            return userId === socket._meteorSession.userId;
        });*/
        var user = Meteor.users.findOne({ 'status.online': true,  _id: userId});
        console.log('---------user status.online:-----------------');

        console.log(!!user);
        console.log('-----------------------------------');
        return !!user;
    },
    /*OLD CODE*/
    reportLocation: function(report){
        if (report.deviceId) {
            console.log(report);
        }
        //console.log('Location reported for userId: ' + report.userId + ', sessionId: ' + report.sessionId + ', lat: ' + report.lat + ', lng: ' + report.lng);
        var userId = report.userId, user;
        if (!userId){
            if (report.deviceId) {
                user = Meteor.users.findOne({deviceIds: report.deviceId});
                if (user) {
                    userId = user._id;
                }
            }
        } else {
            user = Meteor.users.findOne({'_id': report.userId});
        }
        if (user) {
            //if app closed, reports come from native code - send notification if there are nearby posts.
            if (report.deviceId) {
                console.log('trying to send notification about nearby posts');
                var nearbyPosts = bz.bus.proximityHandler.getNearbyPosts(report.lat, report.lng, nearbyRadius);
                console.log(nearbyPosts);
                if (nearbyPosts && nearbyPosts.length > 0) {
                    bz.bus.proximityHandler.notifyNearbyPosts(userId, nearbyPosts);
                }
            }

            var posts = bz.cols.posts.find({
                userId: userId
            }).fetch();
            //var filtered = bz.bus.proximityHandler.filterCircularPosts(posts, lat, lng, nearbyRadius);
            //var ids = _.pluck(filtered, '_id');
            //bz.cols.posts.update({'_id': {$in: ids}}, {$set: {presence: bz.const.posts.status.presence.NEAR}});
            bz.bus.proximityHandler.processLocationReport(posts, report.lat, report.lng);

            if (user && report.sessionId) {
                var setObj = {
                    online: true,
                    sessionIds: user.sessionIds || []
                };
                if (setObj.sessionIds.indexOf(report.sessionId) === -1) {
                    setObj.sessionIds.push(report.sessionId);
                }
                Meteor.users.update({'_id': userId}, {
                    $set: setObj
                });
            }
        } else {
            console.log('user not found');
        }
    },
    notifyNearbyPosts: function(userId, posts){
        if (posts) {
            var filtered = _.filter(posts, function (post) {
                return post.userId !== userId;
            }), post;
            console.log('filtered');
            console.log(filtered);
            if (filtered.length === 1) {
                post = filtered[0];
                console.log('Notifying single post: ' + post.details.title);
                bz.bus.pushHandler.push(userId, 'Activity around you', post.details.title, {
                    type: bz.const.push.type.post,
                    id: post._id
                }, 0);
            } else if (filtered.length > 1) {
                console.log('Notifying multiple posts. Count: ' + filtered.length);
                bz.bus.pushHandler.push(userId, 'Activity around you', 'There are ' + filtered.length + ' posts around you. Check them out!', {
                    type: bz.const.push.type.default
                }, 0);
            }
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
    processUserDisconnect: function(userId, connectionId){
        //console.log('Disconnected');

        var user = Meteor.users.findOne({_id: userId}),
            sessionIds = user.sessionIds;

        if (connectionId && sessionIds.indexOf(connectionId) !== -1){
            sessionIds.splice(sessionIds.indexOf(connectionId), 1);
        }
        var online = bz.bus.proximityHandler.isUserOnline(userId);
            //sessionIds > 0;

        Meteor.users.update({'_id': userId}, {
            $set: {
                online: online,
                sessionIds: sessionIds
            }
        });

        if (!online) {
            var posts = bz.cols.posts.find({
                    userId: userId
                }).fetch(),
                updated;
            _.each(posts, function (post) {
                if (post && post.details && post.details.locations && Array.isArray(post.details.locations)) {
                    updated = false;
                    bz.cols.posts.update({'_id': post._id}, {$set: {presences: {}}});
                }
            });
            Meteor.users.update({_id: userId}, {$set: {sessionIds: []}});
        }
    },
    getObscuredCoords: function(coords, rad){
        if (!coords) {
            return {};
        } else {
            var box = bz.bus.proximityHandler.getLatLngBox(coords.lat, coords.lng, rad);
            if (!box) {
                return {}
            } else {
                return {
                    lat: Math.random() * (box.lat2 - box.lat1) + box.lat1,
                    lng: Math.random() * (box.lng2 - box.lng1) + box.lng1
                };
            }
        }
    },
    processLocationReport: function(posts, lat, lng){
        var updated, presences;
        _.each(posts, function(post){
            if (post && post.details && post.details.locations && Array.isArray(post.details.locations)){
                updated = false;
                presences = {};
                _.each(post.details.locations, function(loc){
                    if (loc.placeType === bz.const.locations.type.DYNAMIC){
                        if (loc.coords.lat !== lat || loc.coords.lng != lng) {
                            //console.log('Updating moving coordinates for ad: ' + post.details.title);
                            loc.coords = {
                                lat: lat,
                                lng: lng,
                                timestamp: new Date()
                            };
                            loc.obscuredCoords=bz.bus.proximityHandler.getObscuredCoords(loc.coords, 0.1);
                            updated = true;
                        }
                        presences[bz.const.locations.type.DYNAMIC] = bz.const.posts.status.presence.NEAR;
                    } else {
                        if (bz.bus.proximityHandler.withinRadius(lat, lng, nearbyRadius, loc)) {
                            //console.log('Changing status to Near for ad: ' + post.details.title);
                            updated = true;
                            presences[loc._id] = bz.const.posts.status.presence.NEAR;
                        }
                    }
                });
                if (updated || !post.presences || Object.keys(presences).length !== Object.keys(post.presences).length){
                    bz.cols.posts.update({'_id': post._id}, {$set: {presences: presences, 'details.locations': post.details.locations}});
                }
            }
        });
    },
    getNearbyPosts: function(lat, lng, radius){
        radius = radius || defaultRadius;
        console.log('getNearbyPosts box: ' + lat + ', ' + lng + ' @ ' + radius);
        var box = bz.bus.proximityHandler.getLatLngBox(lat, lng, radius);
        console.log(box);
        //this is box-shaped filter for increased performance
        var posts =  bz.cols.posts.find({
            'details.locations': {
                $elemMatch: {
                    'coords.lat': {$gte: box.lat1, $lte: box.lat2},
                    'coords.lng': {$gte: box.lng1, $lte: box.lng2}
                }
            },
            status:{
                visible: 'visible'
            },
            endDatePost:{
                $gte: new Date().getTime()
            }
        }).fetch();

        //this if circular filter (as opposed to box-shaped above)
        return bz.bus.proximityHandler.filterCircularPosts(posts, lat, lng, radius);
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
        return c * bz.const.locations.earthRadius;
    },
    withinRadius: function(lat, lng, radius, loc){
        return loc.coords && bz.bus.proximityHandler.distance(lat, lng, loc.coords.lat, loc.coords.lng) <= radius;
    }
};