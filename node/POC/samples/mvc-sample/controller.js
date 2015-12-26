
Meteor.startup(function () {
  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('bz.control.search.location', {
      coords: loc,
      name: T9n.get('MY_LOCATION_TEXT')
    });
  });
});

// controller interface:
changeSearchToOffline = function () {
  // controller manipulates model:
  Session.set('bz.search.offline', true);
}
