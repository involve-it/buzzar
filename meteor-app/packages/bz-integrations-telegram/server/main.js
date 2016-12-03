import { HTTP } from 'meteor/http';

Meteor.startup(function () {
  bz.cols.posts.after.insert(function(userId, doc) {

debugger;
    AddNewPost(doc);
    /*
     var options = {

     }

     HTTP.call('GET', 'https://api.telegram.org/bot311127101:AAFFribgKoIBl4U6UFScpyS6Ceqg81YEkUA/getMe', options, function(error, result = {}) {
      if (!error && result.statusCode === 200) {
        debugger;
        _.each(result, (e, k) => {
          console.log(e, k);
        })
      }
    })*/
  })
});

GetNearbyPosts = function(loc = {}) {
  var request = {
    lat: loc.latitude,
    lng: loc.longitude,
    radius: 1
  }, ret = 'No posts found.. maybe try different location?';

  var res = Meteor.call('getNearbyPostsTest', request);
  if (res && res.result && res.result.length) {
    ret = 'Closest posts found: \n' + res.result.map(i => { return i.details.title + ': '
        + i.details.description + '( /details_' + i._id + ' )' }).join('\n');
  }
  return ret;
}

