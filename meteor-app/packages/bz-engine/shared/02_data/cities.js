
if(Meteor.isClient) {
    bz.cols.cities = new Mongo.Collection('cities');
    Meteor.subscribe('bz.cities');
}