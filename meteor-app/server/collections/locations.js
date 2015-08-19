/**
 * Created by ashot on 8/18/15.
 */
bz.cols.places = new Mongo.Collection('places');
bz.cols.places.remove({});
bz.cols.places.insert({
  name: 'Starbucks',
  coordinates: '...'
});