/**
 * Created by ashot on 8/26/15.
 */

//Поле в документе по которому осуществялется поиск, инициализация настроек

/*
 Meteor.users.initEasySearch('username', {
 'limit' : 2,
 'use' : 'minimongo'
 });
 */
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
          address: { '$regex' : '.*' + searchString + '.*', '$options' : 'i' }
        }
      }
    });
    return query;
  }
});


EasySearch.createSearchIndex('posts', {
  collection: bz.cols.posts,
  use: 'minimongo',
  query: function (searchString, opts) {
    debugger;
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
    /* console.log(query);*/
    return query;
  }
});