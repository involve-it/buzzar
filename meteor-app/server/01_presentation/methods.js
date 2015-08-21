/**
 * Created by ashot on 7/26/15.
 */
Meteor.methods({
  getLocation : function(a, b, c) {
    debugger;
  },
  parseHtml: function(html) {
    var ret = bz.bus.parseHtml(html);
    return ret;
  },
  parseUrl: function(url) {
    return bz.bus.parseUrl(url);
  }
});

// INFO:

// usage on the client:
//Meteor.call('parseHtml', function(error, res) {
//  debugger;
//  alert(res);
//})