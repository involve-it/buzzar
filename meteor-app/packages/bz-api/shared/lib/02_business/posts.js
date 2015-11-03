/**
 * Created by yvdorofeev on 10/22/15.
 */

var helperFunctions = {
  hasLivePresence: function () {
    var loc = null;
    if (this.presences && Object.keys(this.presences).length > 0) {
      _.each(this.presences, function (e, i) {
        if (i !== bz.const.locations.type.DYNAMIC && !loc) {
          loc = _.find(this.details.locations, function (location) {
            return location._id === i;
          });
        }
        if (i === bz.const.locations.type.DYNAMIC) {
          loc = _.find(this.details.locations, function (location) {
            return location.placeType === bz.const.locations.type.DYNAMIC;
          });
        }
      }, this);
    }
    return loc;
  },
  distance: function(){
    var currentLocation = Session.get('currentLocation');
    if (currentLocation && this.details && this.details.locations && Array.isArray(this.details.locations) && this.details.locations.length > 0){
      var loc = _.find(this.details.locations, function(l){ return l.placeType === bz.const.locations.type.DYNAMIC});
      if (!loc){
        loc = this.details.locations[0];
      }
      var distance = bz.help.location.distance(currentLocation.latitude, currentLocation.longitude, loc.coords.lat, loc.coords.lng);
      console.log(distance);
      return distance;
    } else {
      return '';
    }
  }
};

bz.help.makeNamespace('bz.help.posts', helperFunctions);