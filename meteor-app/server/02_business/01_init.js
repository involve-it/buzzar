/**
 * Created by ashot on 8/20/15.
 */
var Business = function() {}

bz.help.makeNamespace({
  path: 'bz.bus',
  object: Business
});

Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://info@shiners.ru:Shiners77@smtp.timeweb.ru:25';
});