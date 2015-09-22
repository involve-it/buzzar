/**
 * Created by Ashot on 9/22/15.
 */
// choose non-administrative from searchNearby
_.filter(f, function(item) {
  console.log('--------');
  console.log(item.types);
  if (_.intersection(administrativeTypes, item.types).length === 0) console.log(_.intersection(administrativeTypes, item.types));
  return _.intersection(administrativeTypes, item.types).length === 0;
}).length