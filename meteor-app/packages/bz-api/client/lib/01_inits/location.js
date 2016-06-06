/**
 * Created by syurdor on 8/26/2015.
 */

var Location = {
    startWatchingLocation: function(){
        //report location only if logged in
        if (Meteor.userId()) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var currentLocation = Session.get('currentLocation');

                if (!currentLocation || currentLocation.accuracy != position.coords.accuracy || currentLocation.latitude != position.coords.latitude || currentLocation.longitude != position.coords.longitude) {
                    Session.set('currentLocation', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                    /*Meteor.call('getNearbyPosts', Meteor.userId(), position.coords.latitude, position.coords.longitude, function(err, result){
                     //update ui
                     console.log(result);
                     });*/
                    //37.314008, -121.791756
                    Meteor.call('reportLocation', {
                        userId: Meteor.userId(),
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        sessionId: Meteor.connection._lastSessionId
                    }, function (err, posts) { });
                }
            });
        }
    },
    logOut: function(){
        if (Meteor.userId()){
            Meteor.call('logOut', Meteor.userId());
        }
    }
};

bz.help.makeNamespace('bz.help.location', Location);

Meteor.startup(function(){
    bz.help.location.startWatchingLocation();
    document.addEventListener('resume', bz.help.location.startWatchingLocation, false);
});