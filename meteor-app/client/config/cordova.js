/**
 * Created by syurdor on 8/26/2015.
 */
Meteor.startup(function(){
    var watchId = navigator.geolocation.watchPosition(function(position){
        console.log('coords: ' + position.coords.latitude + ', ' + position.coords.longitude);
        Session.set('currentLocation', position.coords);
        Meteor.call('getNearbyPosts', Meteor.userId(), position.coords.latitude, position.coords.longitude, function(err, result){
            console.log(result);
        });
    });
});