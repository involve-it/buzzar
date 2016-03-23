/**
 * Created by yvdorofeev on 10/22/15.
 */

var helperFunctions = {
  hasLivePresence: function () {
    var loc = null;
    if(this.status.visible) {
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
    }
    return loc;
  },
  getDistanceToCurrentLocation: function(retNumberFormat){
    var currentLocation = Session.get('currentLocation'), ret, loc, distance, num;
    if (currentLocation && this.details && this.details.locations && Array.isArray(this.details.locations) && this.details.locations.length > 0){
      loc = _.find(this.details.locations, function(l){ return l.placeType === bz.const.locations.type.DYNAMIC});
      if (!loc){
        loc = this.details.locations[0];
       }
      var coords= loc.obscuredCoords || loc.coords;
      distance =  bz.help.location.getDistance(currentLocation.latitude, currentLocation.longitude, coords.lat, coords.lng);
      var user = Meteor.user(), lang;
      
      if(user) {
        lang = user&&user.profile&&user.profile.language;
      } else {
        lang = Session.get('bz.user.language');
      }

      if(!retNumberFormat) {
        if (lang === 'ru') {
          distance = distance * 1.60934;
          if (distance <= .3) {
            ret = (distance * 1000).toFixed(0) + ' м';
          } else if (distance < 10) {
            ret = distance.toFixed(1) + ' км';
          } else {
            ret = distance.toFixed(0) + ' км';
          }
        } else {
          if (distance <= .3) {
            ret = (distance * 5280).toFixed(0) + ' ft';
          } else if (distance < 10) {
            ret = distance.toFixed(1) + ' mi';
          } else {
            ret = distance.toFixed(0) + ' mi';
          }
        }
      } else {
        num = distance.toFixed(3);
        ret = !Number.isNaN(num) ? Number.parseFloat(num): NaN;
      }

    } else {
      ret = retNumberFormat ? Number.MAX_VALUE : '';
    }
    
    return ret;
  },
  getDistanceToCurrentLocationNumber: function(retNumberFormat){
    var currentLocation = Session.get('bz.control.search.location'), ret, loc, distance, num;
    if(currentLocation){
      currentLocation = currentLocation.coords;
    }
    if (currentLocation && this.details && this.details.locations && Array.isArray(this.details.locations) && this.details.locations.length > 0){
      loc = _.find(this.details.locations, function(l){ return l.placeType === bz.const.locations.type.DYNAMIC});
      if (!loc){
        loc = this.details.locations[0];
      }
      var coords= loc.obscuredCoords || loc.coords;
      distance =  bz.help.location.getDistance(currentLocation.lat, currentLocation.lng, coords.lat, coords.lng);
      var user = Meteor.user(),
        lang = user&&user.profile&&user.profile.language;

        if (lang === 'ru') {
          distance = distance * 1.60934;
        } else {

        }
      ret = distance;

    } else {
      ret = Number.MAX_VALUE;
    }
    return ret;
  },
  getLikesAmount: function(){
    return this.social && this.social.likes && this.social.likes.length || '-';
  },
  getDistanceQualifier: function(){
    var distance = this._getDistanceToCurrentLocation();
    if (distance){
      if (distance <= .0378788){
        return '200 ft'
      } else if (distance <= 1){
        return '1 mile'
      } else if (distance <= 5){
        return '5 miles';
      } else if (distance <= 20){
        return '20 miles'
      } else {
        return 'Everywhere';
      }

    } else {
      return '';
    }
  },
  getImagesObjects: function(){
    return _.map(this.details.photos, function(id){
      return bz.cols.images.findOne(id);
    });
  }
};

bz.help.makeNamespace('bz.help.posts', helperFunctions);