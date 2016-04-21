/**
 * Created by ashot on 8/20/15.
 */
var Business = function() {};

//temp
bz.cols.nativeLocationReports = new Mongo.Collection('nativeLocationReports');

bz.help.makeNamespace({
  path: 'bz.bus',
  object: Business
});

Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://info%40shiners.ru:Shiners77@smtp.timeweb.ru:465';
});

Router.map(function() {
  // REST(ish) API
  // Cordova background/foreground can post GPS data HERE
  //
  // POST data should be in this format
  //   {
  //     location: {
  //       latitude: Number,
  //       longitude: Number,
  //       accuracy: Match.Optional(Number),
  //       speed: Match.Optional(Number),
  //       recorded_at: Match.Optional(String)
  //     },
  //     userId: Match.Optional(String),
  //     uuid: Match.Optional(String),
  //     device: Match.Optional(String)
  //   }
  this.route('GeolocationRoute', {
    path: 'api/geolocation',
    where: 'server',
    action: function() {
      // GET, POST, PUT, DELETE
      var requestMethod = this.request.method;
      // Data from a POST request
      if (requestMethod === 'POST') {
        var requestData = this.request.body;
        if (requestData && requestData.deviceId && requestData.lat && requestData.lng) {

          // log stuff
          //console.log('GeolocationBG post: ' + requestMethod);
          //console.log(JSON.stringify(requestData));

          // TODO: security/validation
          //  require some security with data
          //  validate userId/uuid/etc (inside Meteor.call?)

          bz.cols.nativeLocationReports.insert(requestData);

          bz.bus.proximityHandler.reportLocation({
            deviceId: requestData.deviceId,
            lat: requestData.lat,
            lng: requestData.lng,
            timestamp: new Date()
          });
        }
      }

      this.response.writeHead(200, {'Content-Type': 'application/json'});
      this.response.end('ok');
    }
  });
});