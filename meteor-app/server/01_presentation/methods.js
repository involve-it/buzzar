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
  }*/
});

// INFO:

// usage on the client:
//Meteor.call('parseHtml', function(error, res) {
//  debugger;
//  alert(res);
//})