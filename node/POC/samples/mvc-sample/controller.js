
Meteor.startup(function () {
  var location = Session.get('getAccurateAddress') || T9n.get('MY_LOCATION_TEXT');
  
  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('bz.control.search.location', {
      coords: loc,
      name: location
    });
  });
});

// controller interface:
changeSearchToOffline = function () {
  // controller manipulates model:
  Session.set('bz.search.offline', true);
}
