// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See bz-groupon-tests.js for an example of importing.
import settingsConst from './settings.json';
var grouponPosts, grouponPostsCollection;

Meteor.startup(() => {
  bz.cols.grouponPosts = new Mongo.Collection('bz.groupon-posts');
  grouponPostsCollection = bz.cols.grouponPosts;
});

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
  static getPostFromJson(json) {
    let ret = {
      origObj: json,
      details: {
        title: json.announcementTitle,
        description: json.highlightsHtml + json.pitchHtml,
        photos: [
          {
            thumb: json.smallImageUrl,
            image: json.largeImageUrl
          }
        ]
      }
    };



    return ret;
  }
}
if (Meteor.isServer) {


  Meteor.methods({
    'groupon-api-deals': function (loc) {
      debugger;

      var post, url = `https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&lat=${ loc.latitude }&lng=${  loc.longitude }&radius=${ loc.accuracy }`;
      Meteor.http.call('GET', url, {}, (err, res) => {
        if (err) {

        } else if (res) {
          debugger;
          res.data.deals.forEach((item) => {
            post = GrouponPosts.getPostFromJson(item);
            grouponPostsCollection.insert(post);
          });
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
