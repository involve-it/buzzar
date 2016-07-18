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
  this.route('GeolocationRoute', {
    path: 'api/geolocation',
    where: 'server',
    action: function() {
      // GET, POST, PUT, DELETE
      var requestMethod = this.request.method;
      // Data from a POST request
      if (requestMethod === 'POST') {
        var requestData = this.request.body;
        if (requestData && requestData.lat && requestData.lng && requestData.userId) {

          // log stuff
          //console.log('GeolocationBG post: ' + requestMethod);
          //console.log(JSON.stringify(requestData));

          // TODO: security/validation
          //  require some security with data
          //  validate userId/uuid/etc (inside Meteor.call?)

          requestData.timestamp = new Date();
          //todo: remove
          bz.cols.nativeLocationReports.insert(requestData);
          console.log(requestData);

          bz.bus.proximityHandler.reportLocation({
            deviceId: requestData.deviceId,
            userId: requestData.userId,
            lat: requestData.lat,
            lng: requestData.lng,
            background: true
          });
        }
      }

      this.response.writeHead(200, {'Content-Type': 'application/json'});
      this.response.end('ok');
    }
  });
});