/**
 * Created by ashot on 7/26/15.
 */
Meteor.methods({
  getCurrentLocation : function(a, b, c) {
  },
  parseHtml: function(html) {
    var ret = bz.bus.parseHtml(html);
    return ret;
  },
  parseUrl: function(url) {
    return bz.bus.parseUrl(url);
  },
  addNewPost: function(postObject) {
    if(postObject){
      return bz.cols.posts.insert(postObject);
      //return 'EPzoQSGnGCSsPaQjm'
    }
  },
  /*searchPostsByParams: function(params, onlyMy){
    if(typeof params === 'boolean') { // first param is omitted, onlyMy is passed.
      onlyMy = params;
      params = undefined;
    }
    var posts, filter = params || {};
    if (onlyMy){
      filter.userId = Meteor.userId();
    }
    posts = bz.cols.posts.find(filter).fetch();
    return posts;
  },*/
  getNearbyPosts: function(userId, lat, lng){
    return bz.bus.proximityHandler.getNearbyPosts(userId, lat, lng);
  },
  reportLocation: function(userId, lat, lng){
    return bz.bus.proximityHandler.reportLocation(userId, lat, lng);
  },
  registerPushToken: function(deviceId, token){
    bz.bus.pushHandler.registerToken(deviceId, token);
  },
  sendMessageContactUs: function(msg, userId){
    // send email here:
    var emailOptions = {
      from: 'info@buzzar.io',
      to: 'arutune@gmail.com',
      subject: 'from Fantasia: subscribeMe',
      text: 'New message: " ' + msg + '", please contact this user: ' +  userId
    }
    var ret = bz.cols.contactUsMsgs.insert({
      text: msg,
      options: emailOptions,
      userId: userId //optional
    });

    Email.send(emailOptions);
    return ret;
  }
});

// INFO:

// usage on the client:
//Meteor.call('parseHtml', function(error, res) {
//  debugger;
//  alert(res);
//})
