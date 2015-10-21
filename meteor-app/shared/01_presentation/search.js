/**
 * Created by ashot on 8/26/15.
 */


//EASY SEARCH:
/*
 Meteor.users.initEasySearch('username', {
 'limit' : 2,
 'use' : 'minimongo'
 });
 */
/*Meteor.users.initEasySearch('details.title', {
  'limit' : 2,
  'use' : 'minimongo'
});*/
EasySearch.createSearchIndex('users', {
  field: 'username',
  collection: Meteor.users,
  use: 'minimongo',
  query: function (searchString, opts) {
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    // Делает еще поиск и по полю email коллекции Meteor.users
    query.$or.push({
      emails: {
        $elemMatch: {
          address: {'$regex': '.*' + searchString + '.*', '$options': 'i'}
        }
      }
    });
    return query;
  }
});

//bz.cols.posts.initEasySearch(['details.title', 'details.title']);

Meteor.startup(function () {
  EasySearch.createSearchIndex('posts', {
    collection: bz.cols.posts,
    field: 'details.title',
    //field: '_id',
    limit: 200,
    //use: 'minimongo',
    //'use' : 'elastic-search',
    //use: 'mongo-db',
    /*returnFields: {
      details.title
    },*/
    changeResults: function(results){
      return results;
    },
    query: function (searchString, opts) {
      // Default query that is used for searching
      var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
      query.$or.push({
        'details.title': {
          '$regex': '.*' + searchString + '.*', '$options': 'i'
        }
      });
      /* console.log(query);*/
      return query;
    }
  });

  /*if(Meteor.isClient){
    debugger;
    EasySearch.search('posts', '', function (error, data) {
      // use data
      debugger;
    });
  }*/
});

// server-side search:
if (Meteor.isServer) {
  //TODO: review defaults
  //TODO: move into 'server' folder, so it is not exposed
  var defaultDistance = 5,
      defaultLimit = 50;
  Meteor.methods({
    search: function (query, options) {
      /*query = {
        text: searchedText,
        distance: searchDistance,
        activeCats: activeCats
      }*/
      query = query || {};
      options = options || {};

      var textToSearch = query.text,
          distance = query.distance || defaultDistance,
          types = query.catTypes;

      // guard against client-side DOS: hard limit to 50
      if (options.limit) {
        options.limit = Math.min(defaultLimit, Math.abs(options.limit));
      } else {
        options.limit = defaultLimit;
      }

      // TODO fix regexp to support multiple tokens
      var regex = new RegExp(".*" + textToSearch + '.*'),
          location = query.location || {},
          box = query.box || bz.bus.proximityHandler.getLatLngBox(location.lat, location.lng, distance),
          dbQuery = {
            'details.title': {$regex: regex, $options: 'i'}
            },
          ret,
          filter = false;
      //categories

      /*if (!(types && Array.isArray(types) && types.length > 0)) {
        types = _.map(bz.cols.siteTypes.find().fetch(), function(item){ return item.id});
      }*/
      if (query.activeCats && Array.isArray(query.activeCats) && query.activeCats.length > 0) {
        dbQuery.type = {$in: query.activeCats};
      } else {
        dbQuery.type = {$in: _.map(bz.cols.siteTypes.find().fetch(), function(item){ return item.name})}
      }
      //location
      if (box && box.lat1 && box.lat2 && box.lng1 && box.lng2){
        filter = true;
        dbQuery['details.locations'] = {
          $elemMatch: {
            'coords.lat': {$gte: box.lat1, $lte: box.lat2},
            'coords.lng': {$gte: box.lng1, $lte: box.lng2}
          }
        };
      }

      ret = bz.cols.posts.find(dbQuery, options).fetch();
      if (filter){
        ret = bz.bus.proximityHandler.filterCircularPosts(ret, ((box.lat2 - box.lat1)/2) + box.lat1, ((box.lng2 - box.lng1)/2) + box.lng1, distance);
      }


      var activePosts, locations, loc;
      if (options.activeOnly && options.activeOnly === true){
        activePosts = [];
        _.each(ret, function(post){
          if (post && post.details
              && post.details.locations && Array.isArray(post.details.locations) && post.details.locations.length > 0
              && post.presenses && Object.keys(post.presenses).length > 0){
            locations = [];
            _.each(post.presenses, function(presense, i){
              if (presense === bz.const.posts.status.presence.NEAR){
                loc = _.find(post.details.locations, function(loc){
                  return (i && loc._id === i) || (!i && !loc._id);
                });
                if (loc){
                  locations.push(loc);
                }
              }
            });
            if (locations.length > 0){
              //TODO: confirm correct logic here
              post.details.locations = locations;
              activePosts.push(post);
            }
          }
        });
      } else {
        activePosts = ret;
      }

      return activePosts;
    },
    // function for testing in the console Meteor runtime server-side:
    console: function(){
      debugger;
    }
  });
}
