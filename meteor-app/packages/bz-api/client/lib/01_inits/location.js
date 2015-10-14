/**
 * Created by syurdor on 8/26/2015.
 */
Meteor.startup(function(){
    function processCurrentLocation() {
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
                Meteor.call('reportLocation', Meteor.userId(), position.coords.latitude, position.coords.longitude, function (err, posts) {
                });
            }
        });
    }

    processCurrentLocation();
    document.addEventListener('resume', processCurrentLocation, false);
});