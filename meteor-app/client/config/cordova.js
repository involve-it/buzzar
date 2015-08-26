/**
 * Created by syurdor on 8/26/2015.
 */
Meteor.startup(function(){
    var watchId = navigator.geolocation.watchPosition(function(position){
        console.log('coords: ' + position.coords.latitude + ', ' + position.coords.longitude);
        var currentLocation = Session.get('currentLocation');
        if (!currentLocation || currentLocation.accuracy != position.coords.accuracy || currentLocation.latitude != position.coords.latitude || currentLocation.longitude != position.coords.longitude){
            Session.set('currentLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            });
            Meteor.call('getNearbyPosts', Meteor.userId(), position.coords.latitude, position.coords.longitude, function(err, result){
                //update ui
                console.log(result);
            });
        }
    });
});