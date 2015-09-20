/**
 * Created by Ashot on 9/19/15.
 */
//bz.help.makeNamespace('bz.cols.searchRt');
Meteor.startup(function () {
  if (!bz.cols.searchRt && !bz.help.collectionExists('bz.cols.searchRt')) {
    var placesCol = new Meteor.Collection("bz.cols.searchRt"); // client-side only.
    bz.help.makeNamespace('bz.cols.searchRt', placesCol);
  }
  searchPostsReactive();

});


// HELPERS:
/*function callbackNearbySearch(results, status) {
  console.log('results: ', results);
  console.log('status: ', status);
  console.log('length: ', results.length);
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.insert(results[i]);
    }
  }
}*/
function searchPostsReactive() {
  Tracker.autorun(function () {
    bz.cols.posts.find().count();
    var searchedText = Session.get('bz.control.search.searchedText');
    if(searchedText) {
      var query = searchedText,
      //map = GoogleMaps.maps.map.instance, latitude, longitude,
          activeCats = Session.get('bz.control.category-list.activeCategories');
      if (!query && query === undefined) {
        query = '';
      }
      Meteor.call('search', query, activeCats, {}, function (err, results) {
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            bz.cols.searchRt._collection.upsert({_id: results[i]._id}, results[i]);
            //      bz.runtime.maps.places._collection.upsert({name: results[i].name}, results[i]);

          }
        }
      });
    }
  });
}