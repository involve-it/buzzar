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

  Meteor.methods({

  });
}
