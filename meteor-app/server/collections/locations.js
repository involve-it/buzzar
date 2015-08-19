/**
 * Created by ashot on 8/18/15.
 */
o.cols.places = new Mongo.Collection('places');
o.cols.places.remove({});
o.cols.places.insert({
  name: 'Starbucks',
  coordinates: '...'
});