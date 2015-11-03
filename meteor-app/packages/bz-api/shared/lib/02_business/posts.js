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
  getDistanceToCurrentLocation: function(){
    var currentLocation = Session.get('currentLocation');
    if (currentLocation && this.details && this.details.locations && Array.isArray(this.details.locations) && this.details.locations.length > 0){
      var loc = _.find(this.details.locations, function(l){ return l.placeType === bz.const.locations.type.DYNAMIC});
      if (!loc){
        loc = this.details.locations[0];
      }
      return bz.help.location.getDistance(currentLocation.latitude, currentLocation.longitude, loc.coords.lat, loc.coords.lng);
    } else {
      return '';
    }
  },
  getDistanceQualifier: function(){
    var distance = this._getDistanceToCurrentLocation();
    if (distance){
      if (distance <= .0378788){
        return '200 ft'
      } else if (distance <= 1 && distance > .0378788){
        return '1 mile'
      } else if (distance <= 5 && distance > 1){
        return '5 miles';
      } else if (distance <= 20 && distance > 5){
        return '20 miles'
      } else {
        return 'Everywhere';
      }

    } else {
      return '';
    }
  }
};

bz.help.makeNamespace('bz.help.posts', helperFunctions);