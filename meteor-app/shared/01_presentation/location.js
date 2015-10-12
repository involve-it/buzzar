/**
 * Created by arutu_000 on 10/11/2015.
 */
if(Meteor.isServer) {
  Meteor.methods({
    setUserCurrentLocation: function (userId, coords) {
      var name = bz.const.places.CURRENT_LOCATION, id;
      var existLoc = bz.cols.locations.findOne({name: name, userId: userId});
      if (existLoc) {
        //bz.cols.locations.remove(existLoc._id);
        bz.cols.locations.update(existLoc._id, {
          $set: {
            coords: coords
          }
        });
        id = existLoc._id;
      } else {
        id = bz.cols.locations.insert({
          userId: userId,
          name: name,
          coords: coords
        });
      }

      return bz.cols.locations.findOne(id);
    }
  });
}
