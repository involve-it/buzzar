/**
 * Created by douson on 03.07.15.
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