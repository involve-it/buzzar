// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See bz-groupon-tests.js for an example of importing.
import settingsConst from './settings.json';
var grouponPosts;
class GrouponPosts {
  constructor(options) {
    debugger;
    var loc = options.loc;
    if (loc) {


      Meteor.call('groupon-api-deals', loc, (err, res) => {
        debugger;
      });

      /*$.get(url, {__id: 234}, function (data) {
        debugger;
        if (data) {
          console.log(data);
        } else {

        }
      });*/
    }
  }
}
if (Meteor.isServer) {


  Meteor.methods({
    'groupon-api-deals': function (loc) {

      debugger;
      var url = `https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&lat=${ loc.latitude }&lng=${  loc.longitude }&radius=${ loc.accuracy }`;
      HTTP.get(url, {}, function (error, response) {
        debugger;

        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      });
    }
  });
}
Meteor.startup(() => {
  var loc;
  if (Meteor.isClient) {
    //Tracker.autorun(() => {
    //lat=37.4261612&lng=-122.1510967
      loc = Session.get('currentLocation') || {
          latitude: 37.4261612,
          longitude: -122.1510967,
          accuracy: 1
        }; // localhost testing -> Palo Alto
      grouponPosts = new GrouponPosts({
        loc: loc
      });

    //});

  }
});

export default grouponPosts;
