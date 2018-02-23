bz.cols.cities = new Mongo.Collection('cities');

//bz.cols.cities.createIndex( { 'coordinates' : "2dsphere" } );
bz.cols.cities.remove({});

bz.cols.cities.insert({
    name: 'Lipetsk',
    ru: 'Липецк',
    location: { type: "Point", coordinates: [ 52.60311, 39.57076 ] }
    });
bz.cols.cities.insert({
    name: 'Voronezh',
    ru: 'Воронеж',
    location: { type: "Point", coordinates: [ 51.67204, 39.1843 ] }
});

Meteor.publish('bz.cities', function(){
    var ret;
    ret = bz.cols.cities.find();
    return ret;
});